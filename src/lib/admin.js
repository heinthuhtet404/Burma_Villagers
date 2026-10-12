import { supabase } from "./supabase";

/* ============================================================
   CREATE PRODUCT
   ============================================================ */
export async function createProduct(input) {
  const {
    slug,
    name,
    description,
    price,
    isNew = true,
    isActive = true,
    dropId = null,
    images = [],
    variants = [],
  } = input;

  // 1. Insert product
  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      slug,
      name,
      description,
      price,
      is_new: isNew,
      is_active: isActive,
      drop_id: dropId,
    })
    .select()
    .single();

  if (productError) throw productError;

  // 2. Insert images
  if (images.length > 0) {
    const { error: imgError } = await supabase
      .from("product_images")
      .insert(
        images.map((url, i) => ({
          product_id: product.id,
          url,
          position: i,
        }))
      );

    if (imgError) throw imgError;
  }

  // 3. Insert variants
  if (variants.length > 0) {
    const { error: varError } = await supabase
      .from("variants")
      .insert(
        variants.map((v) => ({
          product_id: product.id,
          size: v.size,
          color: v.color,
          color_name: v.colorName,
          stock: v.stock,
          sku: v.sku || null,
        }))
      );

    if (varError) throw varError;
  }

  return product;
}

/* ============================================================
   UPDATE PRODUCT
   ============================================================ */
export async function updateProduct(id, input) {
  const {
    slug,
    name,
    description,
    price,
    isNew,
    isActive,
    dropId,
    images = [],
    variants = [],
  } = input;

  // 1. Update product
  const { error: productError } = await supabase
    .from("products")
    .update({
      slug,
      name,
      description,
      price,
      is_new: isNew,
      is_active: isActive,
      drop_id: dropId,
    })
    .eq("id", id);

  if (productError) throw productError;

  // 2. Replace images — delete old, insert new
  await supabase.from("product_images").delete().eq("product_id", id);

  if (images.length > 0) {
    const { error: imgError } = await supabase
      .from("product_images")
      .insert(
        images.map((url, i) => ({
          product_id: id,
          url,
          position: i,
        }))
      );

    if (imgError) throw imgError;
  }

  // 3. Replace variants — delete old, insert new
  await supabase.from("variants").delete().eq("product_id", id);

  if (variants.length > 0) {
    const { error: varError } = await supabase
      .from("variants")
      .insert(
        variants.map((v) => ({
          product_id: id,
          size: v.size,
          color: v.color,
          color_name: v.colorName,
          stock: v.stock,
          sku: v.sku || null,
        }))
      );

    if (varError) throw varError;
  }
}

/* ============================================================
   DELETE PRODUCT
   ============================================================ */
export async function deleteProduct(id) {
  // Cascades: images + variants deleted automatically via FK
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

/* ============================================================
   GET ALL PRODUCTS (admin — includes inactive)
   ============================================================ */
export async function getAllProductsForAdmin() {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      slug,
      name,
      description,
      price,
      currency,
      is_new,
      is_active,
      drop_id,
      created_at,
      product_images (id, url, position),
      variants (id, size, color, color_name, stock)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((row) => {
    const images = (row.product_images || [])
      .sort((a, b) => a.position - b.position)
      .map((img) => img.url);

    const stock = (row.variants || []).reduce(
      (sum, v) => sum + (v.stock || 0),
      0
    );

    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description,
      price: row.price,
      currency: row.currency,
      isNew: row.is_new,
      isActive: row.is_active,
      dropId: row.drop_id,
      images,
      variants: row.variants || [],
      stock,
      createdAt: row.created_at,
    };
  });
}

/* ============================================================
   GET SINGLE PRODUCT (admin — includes inactive)
   ============================================================ */
export async function getProductForAdmin(id) {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      slug,
      name,
      description,
      price,
      currency,
      is_new,
      is_active,
      drop_id,
      product_images (id, url, position),
      variants (id, size, color, color_name, stock, sku)
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const images = (data.product_images || [])
    .sort((a, b) => a.position - b.position)
    .map((img) => img.url);

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    description: data.description,
    price: data.price,
    currency: data.currency,
    isNew: data.is_new,
    isActive: data.is_active,
    dropId: data.drop_id,
    images,
    variants: (data.variants || []).map((v) => ({
      size: v.size,
      color: v.color,
      colorName: v.color_name,
      stock: v.stock,
      sku: v.sku,
    })),
  };
}

/* ============================================================
   UPLOAD IMAGE to Supabase Storage
   ============================================================ */
export async function uploadProductImage(file) {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;
  const path = `${fileName}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(path);

  return data.publicUrl;
}

/* ============================================================
   DELETE IMAGE from Storage
   ============================================================ */
export async function deleteProductImage(url) {
  // Extract path from URL
  const parts = url.split("/product-images/");
  if (parts.length < 2) return;

  const path = parts[1];

  const { error } = await supabase.storage
    .from("product-images")
    .remove([path]);

  if (error) console.warn("Storage delete error:", error);
}

/* ============================================================
   GET ALL ORDERS (admin)
   ============================================================ */
export async function getAllOrders({ status = null } = {}) {
  let query = supabase
    .from("orders")
    .select(`
      id,
      order_number,
      customer_name,
      customer_email,
      customer_phone,
      city,
      total,
      status,
      payment_status,
      payment_method,
      delivery_method,
      created_at,
      order_items (id, quantity)
    `)
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data, error } = await query;

  if (error) throw error;

  return (data || []).map((row) => ({
    id: row.id,
    orderNumber: row.order_number,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    city: row.city,
    total: row.total,
    status: row.status,
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method,
    deliveryMethod: row.delivery_method,
    createdAt: row.created_at,
    itemCount: (row.order_items || []).reduce(
      (sum, it) => sum + (it.quantity || 0),
      0
    ),
  }));
}

/* ============================================================
   GET SINGLE ORDER (admin)
   ============================================================ */
export async function getOrderById(id) {
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
      updated_at,
      order_items (
        id,
        product_id,
        variant_id,
        product_name,
        product_image,
        size,
        color,
        price,
        quantity
      )
    `)
    .eq("id", id)
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
    updatedAt: data.updated_at,
    items: (data.order_items || []).map((it) => ({
      id: it.id,
      productId: it.product_id,
      variantId: it.variant_id,
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
   UPDATE ORDER STATUS
   ============================================================ */
export async function updateOrderStatus(id, status) {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) throw error;
}

/* ============================================================
   UPDATE PAYMENT STATUS
   ============================================================ */
export async function updatePaymentStatus(id, payment_status) {
  const { error } = await supabase
    .from("orders")
    .update({ payment_status })
    .eq("id", id);

  if (error) throw error;
}

/* ============================================================
   ORDER STATS
   ============================================================ */
export async function getOrderStats() {
  const { data, error } = await supabase
    .from("orders")
    .select("status, payment_status, total");

  if (error) throw error;

  const orders = data || [];
  const total = orders.length;
  const revenue = orders
    .filter((o) => o.payment_status === "paid")
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const byStatus = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  return {
    total,
    revenue,
    pending: byStatus.pending || 0,
    processing: byStatus.processing || 0,
    shipped: byStatus.shipped || 0,
    delivered: byStatus.delivered || 0,
    cancelled: byStatus.cancelled || 0,
  };
}