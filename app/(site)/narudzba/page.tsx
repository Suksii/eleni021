import type { Metadata } from "next";
import PageHero from "@/features/shared/components/page/PageHero";
import CheckoutForm from "@/features/orders/components/CheckoutForm";
import { getSettings } from "@/features/site/api/getSettings";

export const metadata: Metadata = { title: "Narudžba", robots: { index: false } };

export default async function CheckoutPage() {
  const s = await getSettings();
  return (
    <>
      <PageHero label="Korpa" title="Narudžba" crumbs={[{ label: "Narudžba", href: "/narudzba" }]} />
      <div className="wrap">
        <CheckoutForm deliveryFee={Number(s.deliveryFee) || 0} freeDeliveryFrom={Number(s.freeDeliveryFrom) || Infinity} orderNotice={s.orderNotice ?? ""} />
      </div>
    </>
  );
}
