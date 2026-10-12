import Header from "@/features/shared/components/layout/Header";
import Footer from "@/features/shared/components/layout/Footer";
import AnnounceBar from "@/features/shared/components/layout/AnnounceBar";
import BackToTop from "@/features/shared/components/layout/BackToTop";
import ContactButton from "@/features/shared/components/layout/ContactButton";
import CartDrawer from "@/features/cart/components/CartDrawer";
import { CartProvider } from "@/features/cart/CartContext";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <Header />
      {/* Header je fixed/plutajući — sadržaj počinje ispod njega. */}
      <main className="flex-1 pt-24 sm:pt-28">
        <AnnounceBar />
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <BackToTop />
      <ContactButton />
    </CartProvider>
  );
}
