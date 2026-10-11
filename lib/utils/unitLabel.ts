import type { ProductUnit } from "@/db/schema";

export const UNIT_LABEL: Record<ProductUnit, string> = {
  kom: "kom",
  kg: "kg",
  porcija: "porcija",
  set: "set",
};

export const UNIT_OPTIONS = (Object.keys(UNIT_LABEL) as ProductUnit[]).map(
  (value) => ({ value, label: UNIT_LABEL[value] }),
);
