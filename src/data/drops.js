import { products } from "./products";

/**
 * drops.js — metadata for drops
 * Items are looked up from products.js by id (not duplicated).
 */
export const currentDrop = {
  id: "drop-001",
  number: "001",
  name: "350 GSM AIR LAYER",
  tagline: "HEAVY. CLEAN. EVERYDAY.",
  description:
    "The first drop from Burma Villagers. Four colorways of our signature 350 GSM air layer tee — built for structure, made for everyday wear.",
  releaseDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
  status: "live",

  // Hero product — by id
  heroProductId: "drop-001-black",

  // Items in this drop — by id
  itemIds: [
    "drop-001-black",
    "drop-001-white",
    "drop-001-green",
    "drop-001-stone",
  ],
};

/**
 * Helper — resolve the drop with actual product objects
 */
export function resolveDrop(drop) {
  const items = drop.itemIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);

  const heroProduct = products.find((p) => p.id === drop.heroProductId);

  return { ...drop, items, heroProduct };
}

/**
 * Past drops — archive
 */
export const pastDrops = [
  {
    id: "drop-000",
    number: "000",
    name: "PRE-LAUNCH SAMPLE",
    date: "2025.11",
    status: "archived",
  },
];