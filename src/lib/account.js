import { supabase } from "./supabase";

/* ============================================================
   ADDRESSES
   ============================================================ */
export async function getAddresses(userId) {
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createAddress(userId, address) {
  // If this is default — unset others
  if (address.is_default) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", userId);
  }

  const { data, error } = await supabase
    .from("addresses")
    .insert({ ...address, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAddress(id, updates) {
  if (updates.is_default) {
    const { data: addr } = await supabase
      .from("addresses")
      .select("user_id")
      .eq("id", id)
      .single();

    if (addr?.user_id) {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", addr.user_id);
    }
  }

  const { error } = await supabase
    .from("addresses")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
}

export async function deleteAddress(id) {
  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function setDefaultAddress(userId, id) {
  await supabase
    .from("addresses")
    .update({ is_default: false })
    .eq("user_id", userId);

  await supabase
    .from("addresses")
    .update({ is_default: true })
    .eq("id", id);
}

/* ============================================================
   ORDERS (customer side)
   ============================================================ */
export async function getMyOrders(userId) {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      total,
      status,
      payment_status,
      created_at,
      order_items (id, quantity)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((o) => ({
    id: o.id,
    orderNumber: o.order_number,
    total: o.total,
    status: o.status,
    paymentStatus: o.payment_status,
    createdAt: o.created_at,
    itemCount: (o.order_items || []).reduce(
      (sum, it) => sum + (it.quantity || 0),
      0
    ),
  }));
}

export async function getMyOrderById(userId, orderId) {
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
    .eq("id", orderId)
    .eq("user_id", userId)
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