import Hero from "@/features/home/sections/Hero";
import Marquee from "@/features/home/sections/Marquee";
import Vitrina from "@/features/home/sections/Vitrina";
import CategoryList from "@/features/home/sections/CategoryList";
import QuoteBand from "@/features/home/sections/QuoteBand";
import HowItWorks from "@/features/home/sections/HowItWorks";
import CateringTeaser from "@/features/home/sections/CateringTeaser";
import Testimonials from "@/features/home/sections/Testimonials";
import GalleryStrip from "@/features/home/sections/GalleryStrip";
import Closing from "@/features/home/sections/Closing";
import Reveal from "@/features/shared/components/ui/Reveal";
import { getSettings } from "@/features/site/api/getSettings";
import { getCategories } from "@/features/categories/api/getCategories";
import { getFeaturedProducts, getProducts } from "@/features/products/api/getProducts";
import { getFeaturedPackages } from "@/features/catering/api/getPackages";
import { getTestimonials } from "@/features/testimonials/api/getTestimonials";
import { getGallery } from "@/features/gallery/api/getGallery";

export default async function HomePage() {
  const [s, categories, featured, all, packages, testimonials, gallery] =
    await Promise.all([
      getSettings(),
      getCategories(),
      getFeaturedProducts(7),
      getProducts(),
      getFeaturedPackages(3),
      getTestimonials(),
      getGallery(8),
    ]);

  const counts: Record<number, number> = {};
  for (const p of all) if (p.categoryId) counts[p.categoryId] = (counts[p.categoryId] ?? 0) + 1;

  return (
    <>
      <Hero s={s} />
      <Marquee categories={categories} />
      <Reveal><Vitrina products={featured} /></Reveal>
      <Reveal><CategoryList categories={categories} counts={counts} /></Reveal>
      <QuoteBand s={s} />
      <Reveal><HowItWorks s={s} /></Reveal>
      <Reveal><CateringTeaser s={s} packages={packages} /></Reveal>
      <Reveal><Testimonials items={testimonials} /></Reveal>
      <Reveal><GalleryStrip images={gallery} instagram={s.instagram ?? ""} /></Reveal>
      <Closing s={s} />
    </>
  );
}
