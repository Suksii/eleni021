import type { Metadata } from "next";
import PageHero from "@/features/shared/components/page/PageHero";
import GalleryGrid from "@/features/gallery/components/GalleryGrid";
import { getGallery } from "@/features/gallery/api/getGallery";

export const metadata: Metadata = {
  title: "Galerija",
  description: "Torte, slatki stolovi i kolači iz naše radionice.",
};

export default async function GalleryPage() {
  const images = await getGallery();
  return (
    <>
      <PageHero label="Galerija" title="Iz naše radionice" lead="Izbor torti, slatkih stolova i kolača koje smo pravili za naše kupce." crumbs={[{ label: "Galerija", href: "/galerija" }]} />
      <div className="wrap">
        {images.length ? <GalleryGrid images={images} /> : <p className="text-muted">Galerija je trenutno prazna.</p>}
      </div>
    </>
  );
}
