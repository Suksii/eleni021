"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Star } from "lucide-react";
import DeleteButton from "@/features/admin/components/DeleteButton";
import { deleteProduct, toggleProduct } from "@/features/admin/actions/products";
import { cn } from "@/lib/utils/cn";

export default function ProductRowActions({ id, active, featured }: { id: number; active: boolean; featured: boolean }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  const toggle = (field: "active" | "featured", value: boolean) =>
    start(async () => {
      await toggleProduct(id, field, value);
      router.refresh();
    });

  return (
    <div className={cn("flex items-center justify-end gap-1", pending && "opacity-50")}>
      <button type="button" onClick={() => toggle("featured", !featured)} aria-label={featured ? "Ukloni iz izdvojenih" : "Izdvoji"} aria-pressed={featured} className={cn("grid size-8 place-items-center rounded-lg transition-colors", featured ? "text-accent bg-accent-soft" : "text-muted-2 hover:bg-surface-2")}>
        <Star size={15} aria-hidden="true" fill={featured ? "currentColor" : "none"} />
      </button>
      <button type="button" onClick={() => toggle("active", !active)} aria-label={active ? "Sakrij" : "Objavi"} aria-pressed={active} className={cn("grid size-8 place-items-center rounded-lg transition-colors", active ? "text-success bg-success-soft" : "text-muted-2 hover:bg-surface-2")}>
        {active ? <Eye size={15} aria-hidden="true" /> : <EyeOff size={15} aria-hidden="true" />}
      </button>
      <DeleteButton action={deleteProduct.bind(null, id)} label="" confirmLabel="Obriši?" />
    </div>
  );
}
