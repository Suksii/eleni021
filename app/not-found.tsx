import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">404</p>
      <h1 className="font-display mt-3 text-4xl font-medium tracking-tight">Ova strana ne postoji</h1>
      <p className="text-muted mt-3 max-w-[40ch]">Možda je premještena ili je link pogrešan. Slatkiši su i dalje tu.</p>
      <Link href="/" className="bg-primary hover:bg-primary-hover mt-8 inline-flex h-12 items-center rounded-full px-6 font-semibold text-white transition-colors">
        Nazad na početnu
      </Link>
    </div>
  );
}
