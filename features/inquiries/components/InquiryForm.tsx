"use client";

import { useActionState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import Button from "@/features/shared/components/ui/Button";
import Input from "@/features/shared/components/ui/Input";
import Textarea from "@/features/shared/components/ui/Textarea";
import DatePicker from "@/features/shared/components/ui/DatePicker";
import FormAlert from "@/features/shared/components/ui/FormAlert";
import { FIELD_CLS } from "@/features/shared/components/ui/Input";
import { submitInquiry, type InquiryState } from "@/features/inquiries/actions";
import type { InquiryType } from "@/db/schema";
import { cn } from "@/lib/utils/cn";

interface PackageOption {
  id: number;
  name: string;
}

interface InquiryFormProps {
  type: InquiryType;
  packages?: PackageOption[];
  defaultPackageId?: number;
  showEvent?: boolean;
  submitLabel?: string;
  messagePlaceholder?: string;
  className?: string;
}

const INITIAL: InquiryState = { ok: false };

export default function InquiryForm({
  type,
  packages = [],
  defaultPackageId,
  showEvent = false,
  submitLabel = "Pošalji upit",
  messagePlaceholder,
  className,
}: InquiryFormProps) {
  const [state, action, pending] = useActionState(submitInquiry, INITIAL);
  const fe = state.fieldErrors ?? {};

  if (state.ok) {
    return (
      <div
        className={cn(
          "bg-success-soft text-success flex flex-col items-center gap-3 rounded-2xl px-6 py-12 text-center",
          className,
        )}
      >
        <CheckCircle2 size={36} aria-hidden="true" />
        <p className="font-display text-2xl font-semibold">
          Hvala, upit je poslat!
        </p>
        <p className="text-sm">Javljamo vam se u roku od 24h sa ponudom.</p>
      </div>
    );
  }

  return (
    <form action={action} className={cn("space-y-4", className)} noValidate>
      <input type="hidden" name="type" value={type} />
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id={`${type}-name`}
          name="name"
          label="Ime i prezime"
          required
          autoComplete="name"
          error={fe.name}
        />
        <Input
          id={`${type}-phone`}
          name="phone"
          label="Telefon"
          type="tel"
          required
          autoComplete="tel"
          error={fe.phone}
        />
      </div>
      <Input
        id={`${type}-email`}
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        error={fe.email}
      />

      {showEvent && (
        <div className="grid gap-4 sm:grid-cols-2">
          <DatePicker
            id={`${type}-date`}
            name="eventDate"
            label="Datum događaja"
            error={fe.eventDate}
          />
          <Input
            id={`${type}-persons`}
            name="persons"
            label="Broj osoba"
            type="number"
            min={1}
            inputMode="numeric"
            error={fe.persons}
          />
        </div>
      )}

      {packages.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`${type}-package`}
            className="text-[0.82rem] font-semibold"
          >
            Paket koji vas zanima
          </label>
          <select
            id={`${type}-package`}
            name="packageId"
            defaultValue={defaultPackageId ?? ""}
            className={cn(FIELD_CLS, "bg-surface appearance-none")}
          >
            <option value="">Nisam siguran/na — predložite</option>
            {packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <Textarea
        id={`${type}-message`}
        name="message"
        label="Poruka"
        rows={5}
        placeholder={messagePlaceholder}
        error={fe.message}
      />

      {state.error && <FormAlert>{state.error}</FormAlert>}

      <Button
        type="submit"
        size="lg"
        loading={pending}
        className="w-full sm:w-auto"
      >
        <Send size={17} aria-hidden="true" /> {submitLabel}
      </Button>
    </form>
  );
}
