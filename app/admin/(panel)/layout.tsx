import { Suspense } from "react";
import { redirect } from "next/navigation";
import AdminShell from "@/features/admin/components/AdminShell";
import { getSession } from "@/lib/auth/session";
import { getNewCounts } from "@/features/admin/api/counts";

// Celi admin je dinamičan (cookies + sveža baza) — ide iza Suspense granice.
async function Gate({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/prijava");
  const badges = await getNewCounts();
  return (
    <AdminShell badges={badges} userName={session.name || session.email} isOwner={session.role === "owner"}>
      {children}
    </AdminShell>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="bg-surface-2 min-h-dvh" />}>
      <Gate>{children}</Gate>
    </Suspense>
  );
}
