import { supabase } from "./supabase";

/* ============================================================
   FIND VARIANT ID by product + size + color
   ============================================================ */
async function findVariantId(productId, size, color) {
  if (!productId || !size || !color) return null;

  const { data, error } = await supabase
    .from("variants")
    .select("id, stock")
    .eq("product_id", productId)
    .eq("size", size)
    .eq("color", color)
    .maybeSingle();

  if (error) {
    console.warn("findVariantId error:", error);
    return null;
  }

  return data?.id || null;
}

/* ============================================================
   DECREMENT STOCK via RPC
   ============================================================ */
async function decrementStock(variantId, quantity) {
  if (!variantId) return { success: false, message: "No variant ID" };

  const { data, error } = await supabase.rpc("decrement_variant_stock", {
    p_variant_id: variantId,
    p_quantity: quantity,
  });

  if (error) {
    console.error("decrementStock error:", error);
    return { success: false, message: error.message };
  }

  const result = Array.isArray(data) ? data[0] : data;

  if (!result?.success) {
    return {
      success: false,
      message: result?.message || "Stock decrement failed",
    };
  }

  return { success: true, newStock: result.new_stock };
}

/* ============================================================
   CREATE ORDER (guest + signed-in checkout + stock decrement)
   ============================================================ */
export async function createOrder({
  customer,
  items,
  delivery,
  payment,
  subtotal,
  deliveryFee,
  total,
  userId = null, // ← link to account if signed in
}) {
  // 1. Pre-flight: check stock for all items
  const variantMap = new Map(); // key → { variantId, item }

  for (const item of items) {
    const variantId = await findVariantId(item.id, item.size, item.color);

    if (!variantId) {
      throw new Error(
        `"${item.name}" (size ${item.size}) is no longer available.`
      );
    }

    variantMap.set(`${item.id}-${item.size}-${item.color}`, {
      variantId,
      item,
    });
  }

  // 2. Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      address: customer.address,
      city: customer.city || "Yangon",
      notes: customer.notes || null,
      subtotal,
      delivery_fee: deliveryFee,
      total,
      delivery_method: delivery,
      payment_method: payment,
      payment_status: "pending",
      status: "pending",
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // 3. Create order items
  const orderItems = items.map((item) => {
    const entry = variantMap.get(`${item.id}-${item.size}-${item.color}`);
    return {
      order_id: order.id,
      product_id: item.id || null,
      variant_id: entry?.variantId || null,
      product_name: item.name,
      product_image: item.image,
      size: item.size,
      color: item.color,
      price: item.price,
      quantity: item.qty,
    };
  });

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    // Rollback order
    await supabase.from("orders").delete().eq("id", order.id);
    throw itemsError;
  }

  // 4. Decrement stock for each variant
  const decrementErrors = [];

  for (const item of items) {
    const entry = variantMap.get(`${item.id}-${item.size}-${item.color}`);
    if (!entry) continue;

    const result = await decrementStock(entry.variantId, item.qty);

    if (!result.success) {
      decrementErrors.push({
        item,
        message: result.message,
      });
    }
  }

  // ⚠️ If any decrement failed — log but don't rollback
  // (order already placed, admin can handle manually)
  if (decrementErrors.length > 0) {
    console.warn("Some stock decrements failed:", decrementErrors);
  }

  return {
    id: order.id,
    orderNumber: order.order_number,
    ...order,
  };
}

/* ============================================================
   GET ORDER BY NUMBER (for confirmation page)
   ============================================================ */
export async function getOrderByNumber(orderNumber) {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      customer_name,
      customer_email,
      customer_phone,
      address,
      city,
      notes,
      subtotal,
      delivery_fee,
      total,
      delivery_method,
      payment_method,
      payment_status,
      status,
      created_at,
      order_items (
        id,
        product_name,
        product_image,
        size,
        color,
        price,
        quantity
      )
    `)
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    orderNumber: data.order_number,
    customerName: data.customer_name,
    customerEmail: data.customer_email,
    customerPhone: data.customer_phone,
    address: data.address,
    city: data.city,
    notes: data.notes,
    subtotal: data.subtotal,
    deliveryFee: data.delivery_fee,
    total: data.total,
    deliveryMethod: data.delivery_method,
    paymentMethod: data.payment_method,
    paymentStatus: data.payment_status,
    status: data.status,
    createdAt: data.created_at,
    items: (data.order_items || []).map((it) => ({
      id: it.id,
      name: it.product_name,
      image: it.product_image,
      size: it.size,
      color: it.color,
      price: it.price,
      quantity: it.quantity,
    })),
  };
}

/* ============================================================
   RESTORE STOCK (when order cancelled)
   ============================================================ */
export async function restoreOrderStock(orderId) {
  // Get order items with variant_id
  const { data: items, error } = await supabase
    .from("order_items")
    .select("variant_id, quantity")
    .eq("order_id", orderId);

  if (error) throw error;

  for (const item of items || []) {
    if (!item.variant_id) continue;

    const { error: rpcError } = await supabase.rpc(
      "increment_variant_stock",
      {
        p_variant_id: item.variant_id,
        p_quantity: item.quantity,
      }
    );

    if (rpcError) {
      console.warn("restoreStock error:", rpcError);
    }
  }
}

/* ============================================================
   SEND ORDER EMAIL (Edge Function) — optional
   ============================================================ */
export async function sendOrderEmail(order) {
  try {
    const { data, error } = await supabase.functions.invoke(
      "send-order-email",
      {
        body: {
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone,
          address: order.address,
          city: order.city,
          notes: order.notes,
          subtotal: order.subtotal,
          deliveryFee: order.deliveryFee,
          total: order.total,
          deliveryMethod: order.deliveryMethod,
          paymentMethod: order.paymentMethod,
          items: (order.items || []).map((it) => ({
            name: it.name,
            size: it.size,
            color: it.color,
            price: it.price,
            quantity: it.quantity,
          })),
        },
      }
    );

    if (error) {
      console.error("Email send error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Email function error:", err);
    return { success: false, error: err };
  }
}