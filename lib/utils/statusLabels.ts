import type { DeliveryType, InquiryStatus, InquiryType, OrderStatus } from "@/db/schema";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  novo: "Novo",
  potvrdjeno: "Potvrđeno",
  u_izradi: "U izradi",
  zavrseno: "Završeno",
  otkazano: "Otkazano",
};

export const ORDER_STATUS_TONE: Record<OrderStatus, "info" | "warning" | "success" | "neutral" | "danger"> = {
  novo: "info",
  potvrdjeno: "warning",
  u_izradi: "warning",
  zavrseno: "success",
  otkazano: "danger",
};

export const INQUIRY_STATUS_LABEL: Record<InquiryStatus, string> = {
  novo: "Novo",
  odgovoreno: "Odgovoreno",
  arhivirano: "Arhivirano",
};

export const INQUIRY_TYPE_LABEL: Record<InquiryType, string> = {
  ketering: "Ketering",
  kontakt: "Kontakt",
  torta_po_zelji: "Torta po želji",
};

export const DELIVERY_LABEL: Record<DeliveryType, string> = {
  preuzimanje: "Preuzimanje",
  dostava: "Dostava",
};
