export function formatPrice(price, currency = "MMK") {
  if (price == null) return "";
  return `${Number(price).toLocaleString("en-US")} ${currency}`;
}

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}