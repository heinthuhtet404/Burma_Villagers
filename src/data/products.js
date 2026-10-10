import product1 from "../images/product-1.jpg";
import product2 from "../images/product-2.jpg";
import product3 from "../images/product-3.jpg";
import product4 from "../images/product-4.jpg";
import drop1 from "../images/drop-1.jpg";
import drop2 from "../images/drop-2.jpg";
import drop3 from "../images/drop-3.jpg";
import drop4 from "../images/drop-4.jpg";

/**
 * products.js — single source of truth
 * Every item that can appear on the site lives here.
 * "stock" is the number of units available.
 * "status" is derived: available | low | sold
 */
export const products = [
  // ============================================
  // ORIGINAL COLLECTION
  // ============================================
  {
    id: "air-layer-black",
    name: "350 GSM AIR LAYER TEE",
    price: 25000,
    currency: "MMK",
    isNew: false,
    colors: ["#111311", "#F5F3EC", "#1D4020"],
    sizes: ["S", "M", "L", "XL"],
    image: product1,
    description:
      "Heavier-weight fabric designed for a structured, substantial feel. Clean cut, everyday wear.",
    stock: 40,
    total: 50,
  },
  {
    id: "air-layer-white",
    name: "350 GSM AIR LAYER TEE",
    price: 25000,
    currency: "MMK",
    isNew: false,
    colors: ["#F5F3EC", "#111311"],
    sizes: ["S", "M", "L", "XL"],
    image: product2,
    description:
      "Heavier-weight fabric designed for a structured, substantial feel. Clean cut, everyday wear.",
    stock: 22,
    total: 50,
  },
  {
    id: "air-layer-green",
    name: "350 GSM AIR LAYER TEE",
    price: 25000,
    currency: "MMK",
    isNew: false,
    colors: ["#1D4020", "#111311"],
    sizes: ["S", "M", "L", "XL"],
    image: product3,
    description:
      "Heavier-weight fabric designed for a structured, substantial feel. Clean cut, everyday wear.",
    stock: 18,
    total: 50,
  },
  {
    id: "air-layer-ivory",
    name: "350 GSM AIR LAYER TEE",
    price: 25000,
    currency: "MMK",
    isNew: false,
    colors: ["#F5F3EC", "#77786F"],
    sizes: ["S", "M", "L", "XL"],
    image: product4,
    description:
      "Heavier-weight fabric designed for a structured, substantial feel. Clean cut, everyday wear.",
    stock: 30,
    total: 50,
  },

  // ============================================
  // NEW DROP — 001
  // ============================================
  {
    id: "drop-001-black",
    name: "350 GSM AIR LAYER TEE",
    price: 25000,
    currency: "MMK",
    isNew: true,
    dropId: "drop-001",
    colors: ["#111311", "#F5F3EC", "#1D4020"],
    sizes: ["S", "M", "L", "XL"],
    image: drop1,
    description:
      "Part of Drop 001. Heavier-weight fabric designed for a structured, substantial feel. Clean cut, everyday wear.",
    stock: 12,
    total: 50,
  },
  {
    id: "drop-001-white",
    name: "350 GSM AIR LAYER TEE",
    price: 25000,
    currency: "MMK",
    isNew: true,
    dropId: "drop-001",
    colors: ["#F5F3EC", "#111311"],
    sizes: ["S", "M", "L", "XL"],
    image: drop2,
    description:
      "Part of Drop 001. Heavier-weight fabric designed for a structured, substantial feel. Clean cut, everyday wear.",
    stock: 8,
    total: 50,
  },
  {
    id: "drop-001-green",
    name: "350 GSM AIR LAYER TEE",
    price: 25000,
    currency: "MMK",
    isNew: true,
    dropId: "drop-001",
    colors: ["#1D4020", "#111311"],
    sizes: ["S", "M", "L", "XL"],
    image: drop3,
    description:
      "Part of Drop 001. Heavier-weight fabric designed for a structured, substantial feel. Clean cut, everyday wear.",
    stock: 22,
    total: 50,
  },
  {
    id: "drop-001-stone",
    name: "350 GSM AIR LAYER TEE",
    price: 25000,
    currency: "MMK",
    isNew: true,
    dropId: "drop-001",
    colors: ["#F5F3EC", "#77786F"],
    sizes: ["S", "M", "L", "XL"],
    image: drop4,
    description:
      "Part of Drop 001. Heavier-weight fabric designed for a structured, substantial feel. Clean cut, everyday wear.",
    stock: 0,
    total: 50,
  },
];

export const formatPrice = (price, currency = "MMK") =>
  `${price.toLocaleString("en-US")} ${currency}`;

/**
 * Helper — derive status from stock.
 * - "sold"      : stock === 0
 * - "low"       : stock <= 10
 * - "available" : otherwise
 */
export function getProductStatus(product) {
  if (!product || product.stock <= 0) return "sold";
  if (product.stock <= 10) return "low";
  return "available";
}

/**
 * Helper — find by id
 */
export function getProductById(id) {
  return products.find((p) => p.id === id);
}