"use client";

import Image from "next/image";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import DeleteButton from "@/features/admin/components/DeleteButton";
import { deleteGalleryImage, updateGalleryImage } from "@/features/admin/actions/gallery";
import type { GalleryImage } from "@/db/schema";
import { cn } from "@/lib/utils/cn";

export default function GalleryManager({ images }: { images: GalleryImage[] }) {
  const [pending, start] = useTransition();
  const router = useRouter();

  const update = (id: number, data: Parameters<typeof updateGalleryImage>[1]) =>
    start(async () => {
      await updateGalleryImage(id, data);
      router.refresh();
      toast.success("Sačuvano.");
    });

  return (
    <ul className={cn("grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5", pending && "opacity-60")}>
      {images.map((g) => (
        <li key={g.id} className="bg-surface shadow-card overflow-hidden rounded-2xl">
          <div className="bg-surface-2 relative aspect-square">
            <Image src={g.image} alt="" fill sizes="240px" className="object-cover" unoptimized={g.image.startsWith("/uploads/")} />
            {!g.active && <span className="absolute top-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-[0.65rem] font-bold text-white">Sakrivena</span>}
          </div>
          <div className="space-y-2 p-3">
            <input type="text" defaultValue={g.caption} placeholder="Opis (opciono)" aria-label="Opis slike" onBlur={(e) => { if (e.target.value !== g.caption) update(g.id, { caption: e.target.value }); }} className="border-line-2 focus:border-primary w-full rounded-lg border px-2.5 py-1.5 text-xs outline-none" />
            <div className="flex items-center justify-between gap-2">
              <input type="number" defaultValue={g.sortOrder} aria-label="Redosled" onBlur={(e) => { const v = Number(e.target.value); if (v !== g.sortOrder) update(g.id, { sortOrder: v }); }} className="border-line-2 focus:border-primary w-16 rounded-lg border px-2 py-1.5 text-xs outline-none" />
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => update(g.id, { active: !g.active })} aria-label={g.active ? "Sakrij" : "Prikaži"} className={cn("grid size-8 place-items-center rounded-lg", g.active ? "text-success bg-success-soft" : "text-muted-2 hover:bg-surface-2")}>
                  {g.active ? <Eye size={15} aria-hidden="true" /> : <EyeOff size={15} aria-hidden="true" />}
                </button>
                <DeleteButton action={deleteGalleryImage.bind(null, g.id)} label="" confirmLabel="Obriši?" />
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
