import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeader, Card, Empty, StatusBadge } from "@/features/admin/components/AdminPage";
import { Table, Td, Th } from "@/features/admin/components/Table";
import { CHANNELS, getStats, type Channel } from "@/features/admin/api/stats";
import { getSession } from "@/lib/auth/session";
import { formatDate } from "@/lib/utils/formatDate";
import { formatPrice } from "@/lib/utils/formatPrice";

export const metadata: Metadata = { title: "Statistika · Administracija" };

const CHANNEL_LABEL: Record<Channel, string> = {
  poziv: "Poziv",
  viber: "Viber",
  whatsapp: "WhatsApp",
  email: "Email",
  instagram: "Instagram",
};

// Odakle je klik: putanja + deo sajta ("#dugme", "#header", "#footer", "#kontakt").
function splitPath(p: string): { path: string; where: string } {
  const [path, where = ""] = p.split("#");
  return { path: path || "/", where };
}

export default async function StatsPage() {
  // Samo vlasnik sajta — klijent ne vidi ni link ni stranicu.
  const session = await getSession();
  if (session?.role !== "owner") notFound();

  const { periods, recent } = await getStats();

  return (
    <>
      <AdminHeader title="Statistika" lead="Klikovi na kontakt, narudžbe i upiti. Anonimno — samo šta, odakle i kada." />

      <div className="grid gap-4 md:grid-cols-3">
        {periods.map((p) => (
          <Card key={p.days} className="p-5">
            <p className="text-muted text-xs font-semibold tracking-wide uppercase">{p.label}</p>
            <p className="font-display mt-2 text-3xl font-semibold">{p.clicksTotal} <span className="text-muted text-base font-normal">klikova na kontakt</span></p>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              {CHANNELS.map((c) => (
                <li key={c} className="flex justify-between"><span className="text-muted">{CHANNEL_LABEL[c]}</span><span className="font-semibold tabular-nums">{p.clicks[c]}</span></li>
              ))}
            </ul>
            <div className="border-border mt-4 grid grid-cols-2 gap-2 border-t pt-3 text-sm">
              <div><p className="text-muted">Narudžbe</p><p className="font-semibold tabular-nums">{p.orders} <span className="text-muted font-normal">· {formatPrice(p.revenue)}</span></p></div>
              <div><p className="text-muted">Upiti</p><p className="font-semibold tabular-nums">{p.inquiries}</p></div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <div className="px-5 pt-5 pb-3">
          <h2 className="font-display text-lg font-semibold">Poslednji klikovi</h2>
          <p className="text-muted text-xs">Poslednjih 100. Klik znači da je neko otvorio pozivanje, Viber ili WhatsApp, ne da je poziv obavljen.</p>
        </div>
        {recent.length === 0 ? (
          <Empty>Još nema zabeleženih klikova.</Empty>
        ) : (
          <Table>
            <thead><tr><Th>Kada</Th><Th>Kanal</Th><Th>Stranica</Th><Th>Odakle</Th></tr></thead>
            <tbody>
              {recent.map((e) => {
                const { path, where } = splitPath(e.path);
                return (
                  <tr key={e.id}>
                    <Td className="text-muted whitespace-nowrap text-xs">{formatDate(e.createdAt, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</Td>
                    <Td><StatusBadge label={CHANNEL_LABEL[e.channel as Channel] ?? e.channel} tone={e.channel === "poziv" ? "info" : "neutral"} /></Td>
                    <Td className="font-mono text-xs">{path}</Td>
                    <Td className="text-muted text-xs">{where || "—"}</Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}
