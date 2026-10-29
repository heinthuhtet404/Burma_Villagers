import { supabase } from "./supabase";

/* ============================================================
   CREATE ORDER (via Edge Function — server-validated prices)
   ============================================================ */
export async function createOrder({
  customer,
  items,
  delivery,
  payment,
  paymentProofUrl = null,
  paymentReference = null,
}) {
  // Get current session (for auth.uid — guests are null)
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers = {
    "Content-Type": "application/json",
  };

  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  }

  // ✅ Cart item fields ကို normalize — id/qty ကို အလွယ်တကူ ခေါ်နိုင်
  const normalizedItems = (items || [])
    .map((it) => {
      const productId = it.productId ?? it.id ?? null;
      const quantity = Number(it.quantity ?? it.qty ?? 0);

      return {
        productId,
        size: it.size ?? null,
        color: it.color ?? null,
        quantity,
      };
    })
    .filter((it) => it.productId && it.quantity > 0);

  if (normalizedItems.length === 0) {
    throw new Error("Cart is empty — nothing to order.");
  }

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-order`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        customer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          city: customer.city || "Yangon",
          notes: customer.notes || "",
        },
        items: normalizedItems,
        deliveryMethod: delivery,
        paymentMethod: payment,
        paymentProofUrl,
        paymentReference: paymentReference || null,
      }),
    }
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Edge Function က error ကို data.error (သို့) data.message မှာ ပို့နိုင်
    const message =
      data?.error ||
      data?.message ||
      `Order failed (${res.status}). Please try again.`;
    throw new Error(message);
  }

  return {
    id: data.orderId,
    orderNumber: data.orderNumber,
    subtotal: data.subtotal,
    deliveryFee: data.deliveryFee,
    total: data.total,
    depositAmount: data.depositAmount,
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
      payment_proof_url,
      deposit_amount,
      payment_reference,
      payment_note,
      payment_verified_at,
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
    paymentProofUrl: data.payment_proof_url,
    depositAmount: data.deposit_amount,
    paymentReference: data.payment_reference,
    paymentNote: data.payment_note,
    paymentVerifiedAt: data.payment_verified_at,
    status: data.status,
    createdAt: data.created_at,
    items: (data.order_items || []).map((it) => ({
      id: it.id,
      name: it.product_name,
      image: it.product_image,
      size: it.size ?? null,
      color: it.color ?? null,
      price: it.price,
      quantity: it.quantity,
    })),
  };
}

/* ============================================================
   RESTORE STOCK (when order cancelled)
   ============================================================ */
export async function restoreOrderStock(orderId) {
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
   SEND ORDER EMAIL (Edge Function — optional)
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
            size: it.size ?? null,
            color: it.color ?? null,
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