"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Link2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { FIELD_CLS } from "@/features/shared/components/ui/Input";
import { cn } from "@/lib/utils/cn";

interface ImagePickerProps {
  name: string;
  label: string;
  defaultValue?: string[] | string;
  multiple?: boolean;
  hint?: string;
}

async function upload(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error ?? "Upload nije uspio.");
  return json.url as string;
}

// Lista slika (URL ili upload); vrednost ide u formu kao JSON u hidden polju.
export default function ImagePicker({ name, label, defaultValue, multiple = false, hint }: ImagePickerProps) {
  const initial = Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : [];
  const [images, setImages] = useState<string[]>(initial);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const addUrls = (urls: string[]) => {
    setImages((prev) => (multiple ? [...prev, ...urls] : urls.slice(-1)));
  };

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      const urls: string[] = [];
      for (const f of Array.from(files)) urls.push(await upload(f));
      addUrls(urls);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload nije uspio.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const addUrl = () => {
    const v = url.trim();
    if (!/^(https?:\/\/|\/)/.test(v)) {
      toast.error("Unesite ispravan URL slike.");
      return;
    }
    addUrls([v]);
    setUrl("");
  };

  const move = (i: number, dir: -1 | 1) => {
    setImages((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[0.82rem] font-semibold">{label}</span>
      <input type="hidden" name={name} value={JSON.stringify(images)} />

      {images.length > 0 && (
        <ul className={cn("grid gap-3", multiple ? "grid-cols-3 sm:grid-cols-4 md:grid-cols-5" : "grid-cols-2 sm:grid-cols-3")}>
          {images.map((src, i) => (
            <li key={src + i} className="bg-surface-2 group relative aspect-square overflow-hidden rounded-xl">
              <Image src={src} alt="" fill sizes="160px" className="object-cover" unoptimized={src.startsWith("/uploads/")} />
              <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-gradient-to-t from-black/60 p-1.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                {multiple && (
                  <>
                    <button type="button" onClick={() => move(i, -1)} aria-label="Pomeri napred" className="grid size-7 place-items-center rounded-md bg-white/90 text-foreground"><ArrowUp size={14} aria-hidden="true" /></button>
                    <button type="button" onClick={() => move(i, 1)} aria-label="Pomeri nazad" className="grid size-7 place-items-center rounded-md bg-white/90 text-foreground"><ArrowDown size={14} aria-hidden="true" /></button>
                  </>
                )}
                <button type="button" onClick={() => setImages((p) => p.filter((_, j) => j !== i))} aria-label="Ukloni sliku" className="grid size-7 place-items-center rounded-md bg-white/90 text-danger"><X size={14} aria-hidden="true" /></button>
              </div>
              {multiple && i === 0 && <span className="absolute top-1.5 left-1.5 rounded-md bg-white/90 px-1.5 py-0.5 text-[0.65rem] font-bold">Glavna</span>}
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Link2 size={15} aria-hidden="true" className="text-muted-2 pointer-events-none absolute top-1/2 left-4 -translate-y-1/2" />
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addUrl(); } }} placeholder="https://… URL slike" className={cn(FIELD_CLS, "h-11 pl-10")} />
        </div>
        <button type="button" onClick={addUrl} className="border-line-2 hover:border-foreground h-11 rounded-xl border-[1.5px] px-4 text-sm font-semibold">Dodaj URL</button>
        <label className={cn("bg-foreground hover:bg-primary inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white transition-colors", busy && "pointer-events-none opacity-60")}>
          {busy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <ImagePlus size={16} aria-hidden="true" />}
          Upload
          <input ref={fileRef} type="file" accept="image/*" multiple={multiple} className="sr-only" onChange={(e) => onFiles(e.target.files)} />
        </label>
      </div>
      {hint && <p className="text-muted text-xs">{hint}</p>}
    </div>
  );
}
