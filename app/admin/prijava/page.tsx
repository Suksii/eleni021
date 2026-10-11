import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/features/admin/components/LoginForm";

export const metadata: Metadata = { title: "Prijava · Administracija", robots: { index: false } };

async function Form({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return <LoginForm next={next} />;
}

export default function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  return (
    <div className="bg-surface-2 flex min-h-dvh items-center justify-center p-4">
      <div className="bg-surface shadow-custom w-full max-w-sm rounded-3xl p-8">
        <p className="eyebrow">Eleni</p>
        <h1 className="font-display mt-1 text-2xl font-semibold">Administracija</h1>
        <p className="text-muted mt-1 mb-6 text-sm">Prijavite se da uređujete sadržaj sajta.</p>
        <Suspense fallback={<LoginForm />}>
          <Form searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
