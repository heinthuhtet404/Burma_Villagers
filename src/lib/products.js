import { supabase } from "./supabase";

/* ============================================================
   PRODUCT QUERY SHAPE
   ============================================================ */
const PRODUCT_SELECT = `
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
`;

/* ============================================================
   Helper — compute total stock from variants
   ============================================================ */
function computeStock(variants = []) {
  return variants.reduce((sum, v) => sum + (v.stock || 0), 0);
}

/* ============================================================
   Helper — derive status
   ============================================================ */
export function getProductStatus(product) {
  if (!product) return "sold";
  const stock = product.stock ?? computeStock(product.variants);
  if (stock <= 0) return "sold";
  if (stock <= 10) return "low";
  return "available";
}

/* ============================================================
   Helper — normalize product from Supabase
   ============================================================ */
function normalizeProduct(row) {
  if (!row) return null;

  const images = (row.product_images || [])
    .sort((a, b) => a.position - b.position)
    .map((img) => img.url);

  const variants = row.variants || [];
  const stock = computeStock(variants);

  // unique sizes / colors
  const sizes = Array.from(new Set(variants.map((v) => v.size))).sort(
    (a, b) => {
      const order = { S: 0, M: 1, L: 2, XL: 3, XXL: 4 };
      return (order[a] ?? 99) - (order[b] ?? 99);
    }
  );

  const colors = Array.from(
    new Map(
      variants.map((v) => [v.color, { hex: v.color, name: v.color_name }])
    ).values()
  );

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: row.price,
    currency: row.currency || "MMK",
    isNew: row.is_new,
    isActive: row.is_active,
    dropId: row.drop_id,
    images: images.length > 0 ? images : ["/images/placeholder.jpg"],
    image: images[0] || "/images/placeholder.jpg",
    variants,
    sizes,
    colors: colors.map((c) => c.hex),
    colorNames: colors,
    stock,
    createdAt: row.created_at,
  };
}

/* ============================================================
   GET ALL PRODUCTS
   ============================================================ */
export async function getProducts({ onlyNew = false } = {}) {
  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (onlyNew) {
    query = query.eq("is_new", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getProducts error:", error);
    throw error;
  }

  return (data || []).map(normalizeProduct);
}

/* ============================================================
   GET PRODUCTS BY DROP
   ============================================================ */
export async function getProductsByDrop(dropId) {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .eq("drop_id", dropId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getProductsByDrop error:", error);
    throw error;
  }

  return (data || []).map(normalizeProduct);
}

/* ============================================================
   GET SINGLE PRODUCT (by id OR slug)
   ============================================================ */
export async function getProduct(idOrSlug) {
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      idOrSlug
    );

  const column = isUuid ? "id" : "slug";

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq(column, idOrSlug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("getProduct error:", error);
    throw error;
  }

  return normalizeProduct(data);
}

/* ============================================================
   SEARCH PRODUCTS
   ============================================================ */
export async function searchProducts(query) {
  if (!query || !query.trim()) return [];

  const q = `%${query.trim().toLowerCase()}%`;

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .ilike("name", q)
    .limit(8);

  if (error) {
    console.error("searchProducts error:", error);
    throw error;
  }

  return (data || []).map(normalizeProduct);
}


/* ============================================================
   GET VARIANT STOCK (real-time check)
   ============================================================ */
export async function getVariantStock(productId) {
  const { data, error } = await supabase
    .from("variants")
    .select("size, color, stock")
    .eq("product_id", productId);

  if (error) throw error;

  return (data || []).reduce((acc, v) => {
    acc[`${v.size}-${v.color}`] = v.stock;
    return acc;
  }, {});
}

/* ============================================================
   GET LOW STOCK PRODUCTS (admin)
   ============================================================ */
export async function getLowStockProducts(threshold = 5) {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      slug,
      name,
      is_active,
      variants (id, size, color, color_name, stock)
    `)
    .eq("is_active", true);

  if (error) throw error;

  return (data || [])
    .map((p) => {
      const totalStock = (p.variants || []).reduce(
        (sum, v) => sum + (v.stock || 0),
        0
      );
      const lowVariants = (p.variants || []).filter(
        (v) => v.stock > 0 && v.stock <= threshold
      );
      const outOfStock = (p.variants || []).filter(
        (v) => v.stock === 0
      );
      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        totalStock,
        lowVariants,
        outOfStock,
      };
    })
    .filter((p) => p.totalStock <= threshold);
}

/* ============================================================
   GET PRODUCTS PAGINATED
   Returns: { products, total, hasMore }
   ============================================================ */
export async function getProductsPaginated({
  limit = 12,
  offset = 0,
  onlyNew = false,
} = {}) {
  const { data, error } = await supabase.rpc("get_products_paginated", {
    p_limit: limit,
    p_offset: offset,
    p_only_new: onlyNew,
  });

  if (error) {
    console.error("getProductsPaginated error:", error);
    throw error;
  }

  const rows = data || [];
  const total = rows[0]?.total_count ? Number(rows[0].total_count) : 0;

  const products = rows.map((row) => {
    const images = (row.product_images || [])
      .sort((a, b) => a.position - b.position)
      .map((img) => img.url);

    const variants = row.variants || [];
    const stock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);

    const sizes = Array.from(
      new Set(variants.map((v) => v.size))
    ).sort((a, b) => {
      const order = { S: 0, M: 1, L: 2, XL: 3, XXL: 4 };
      return (order[a] ?? 99) - (order[b] ?? 99);
    });

    const colors = Array.from(
      new Map(
        variants.map((v) => [
          v.color,
          { hex: v.color, name: v.color_name },
        ])
      ).values()
    );

    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description,
      price: row.price,
      currency: row.currency || "MMK",
      isNew: row.is_new,
      isActive: row.is_active,
      dropId: row.drop_id,
      images: images.length > 0 ? images : ["/images/placeholder.jpg"],
      image: images[0] || "/images/placeholder.jpg",
      variants,
      sizes,
      colors: colors.map((c) => c.hex),
      colorNames: colors,
      stock,
      createdAt: row.created_at,
    };
  });

  return {
    products,
    total,
    hasMore: offset + products.length < total,
  };
}