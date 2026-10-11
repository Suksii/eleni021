import Link from "next/link";
import AdminNav from "@/features/admin/components/AdminNav";
import { logout } from "@/features/admin/actions/auth";
import { LogOut } from "lucide-react";

export default function AdminShell({
  children,
  badges,
  userName,
}: {
  children: React.ReactNode;
  badges: { orders: number; inquiries: number };
  userName: string;
}) {
  return (
    <div className="bg-surface-2 flex min-h-dvh flex-col lg:flex-row">
      <aside className="bg-surface border-border sticky top-0 z-30 border-b lg:h-dvh lg:w-64 lg:shrink-0 lg:border-r lg:border-b-0">
        <div className="border-border flex items-center justify-between border-b px-5 py-4">
          <Link href="/admin" className="font-display text-xl font-semibold">Eleni <span className="text-muted text-sm font-sans font-normal">CMS</span></Link>
          <form action={logout} className="lg:hidden">
            <button type="submit" aria-label="Odjava" className="hover:bg-surface-2 grid size-9 place-items-center rounded-full"><LogOut size={17} aria-hidden="true" /></button>
          </form>
        </div>
        <div className="lg:h-[calc(100dvh-4.1rem)]">
          <AdminNav badges={badges} userName={userName} />
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
