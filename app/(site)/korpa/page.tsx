import { redirect } from "next/navigation";

// Korpa je drawer; posebna strana vodi na narudžbu.
export default function CartPage() {
  redirect("/narudzba");
}
