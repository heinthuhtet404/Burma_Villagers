import product1 from "../images/product-1.jpg";
import product2 from "../images/product-2.jpg";
import product3 from "../images/product-3.jpg";
import product4 from "../images/product-4.jpg";

export const products = [
  {
    id: "air-layer-black",
    name: "350 GSM AIR LAYER TEE",
    price: 25000,
    currency: "MMK",
    isNew: true,
    colors: ["#111311", "#F5F3EC", "#1D4020"],
    sizes: ["S", "M", "L", "XL"],
    image: product1,
    description:
      "Heavier-weight fabric designed for a structured, substantial feel. Clean cut, everyday wear.",
  },
  {
    id: "air-layer-white",
    name: "350 GSM AIR LAYER TEE",
    price: 25000,
    currency: "MMK",
    isNew: true,
    colors: ["#F5F3EC", "#111311"],
    sizes: ["S", "M", "L", "XL"],
    image: product2,
    description:
      "Heavier-weight fabric designed for a structured, substantial feel. Clean cut, everyday wear.",
  },
  {
    id: "air-layer-green",
    name: "350 GSM AIR LAYER TEE",
    price: 25000,
    currency: "MMK",
    isNew: true,
    colors: ["#1D4020", "#111311"],
    sizes: ["S", "M", "L", "XL"],
    image: product3,
    description:
      "Heavier-weight fabric designed for a structured, substantial feel. Clean cut, everyday wear.",
  },
  {
    id: "air-layer-ivory",
    name: "350 GSM AIR LAYER TEE",
    price: 25000,
    currency: "MMK",
    isNew: true,
    colors: ["#F5F3EC", "#77786F"],
    sizes: ["S", "M", "L", "XL"],
    image: product4,
    description:
      "Heavier-weight fabric designed for a structured, substantial feel. Clean cut, everyday wear.",
  },
];

export const formatPrice = (price, currency = "MMK") =>
  `${price.toLocaleString("en-US")} ${currency}`;