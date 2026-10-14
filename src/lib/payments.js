import { supabase } from "./supabase";

/* ============================================================
   PAYMENT CONFIG
   ============================================================ */
export const PAYMENT_CONFIG = {
  kpay_wave: {
    id: "kpay_wave",
    label: "KPAY / WAVE PAY",
    description: "Transfer full amount to our KPay or Wave account",
    type: "full",
    accounts: [
      { name: "KPay", phone: "09455868228", holder: "Hein Thu Htet" },
      { name: "Wave Pay", phone: "09455868228", holder: "Hein Thu Htet" },
    ],
    requiresProof: true,
    proofLabel: "Payment Screenshot",
  },
  cod: {
    id: "cod",
    label: "CASH ON DELIVERY",
    description: "Pay 5,000 MMK deposit now, rest on delivery",
    type: "deposit",
    depositAmount: 5000,
    accounts: [
      { name: "KPay", phone: "09455868228", holder: "Hein Thu Htet" },
      { name: "Wave Pay", phone: "09455868228", holder: "Hein Thu Htet" },
    ],
    requiresProof: true,
    proofLabel: "Deposit Screenshot",
  },
};

/* ============================================================
   UPLOAD PAYMENT PROOF to Supabase Storage
   ============================================================ */
export async function uploadPaymentProof(file) {
  if (!file) throw new Error("No file provided");

  // Validate
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File must be under 5MB");
  }

  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from("payment-proofs")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from("payment-proofs")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

/* ============================================================
   DELETE PAYMENT PROOF
   ============================================================ */
export async function deletePaymentProof(url) {
  if (!url) return;

  const parts = url.split("/payment-proofs/");
  if (parts.length < 2) return;

  const path = parts[1];

  const { error } = await supabase.storage
    .from("payment-proofs")
    .remove([path]);

  if (error) console.warn("deleteProof error:", error);
}