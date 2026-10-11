"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { ProductUnit } from "@/db/schema";

export interface CartItem {
  productId: number;
  name: string;
  slug: string;
  image: string;
  unit: ProductUnit;
  price: number;
  quantity: number;
  minQuantity: number;
  leadTimeDays: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  hydrated: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
}

const STORAGE_KEY = "eleni_cart_v1";
const EMPTY: CartItem[] = [];

// Korpa je eksterni store (localStorage) — `useSyncExternalStore` daje serveru
// prazan snapshot, a klijentu pravi, bez setState-a u effectu.
let snapshot: CartItem[] | null = null;
const listeners = new Set<() => void>();

function read(): CartItem[] {
  if (snapshot) return snapshot;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    snapshot = Array.isArray(parsed) ? parsed : [];
  } catch {
    snapshot = [];
  }
  return snapshot;
}

function write(next: CartItem[]) {
  snapshot = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      snapshot = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const stored = useSyncExternalStore(subscribe, read, () => EMPTY);
  const [isOpen, setIsOpen] = useState(false);

  // `mounted` preko state-a, ne preko useSyncExternalStore: prvi klijentski
  // render je tako uvek jednak serverskom (prazna korpa) bez obzira na to da li
  // React hidrira Suspense granicu ili je renderuje iznova — a tek posle
  // montiranja se pokaže stvarni sadržaj iz localStorage-a.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- namerno: prelaz posle hidratacije
    setHydrated(true);
  }, []);
  const items = hydrated ? stored : EMPTY;

  const add = useCallback<CartContextValue["add"]>((item, quantity) => {
    const prev = read();
    const qty = Math.max(quantity ?? item.minQuantity, item.minQuantity);
    const existing = prev.find((i) => i.productId === item.productId);
    write(
      existing
        ? prev.map((i) => (i.productId === item.productId ? { ...i, quantity: i.quantity + qty } : i))
        : [...prev, { ...item, quantity: qty }],
    );
    setIsOpen(true);
  }, []);

  const setQuantity = useCallback((productId: number, quantity: number) => {
    write(
      read()
        .map((i) => (i.productId === productId ? { ...i, quantity: Math.max(i.minQuantity, quantity) } : i))
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const remove = useCallback((productId: number) => {
    write(read().filter((i) => i.productId !== productId));
  }, []);

  const clear = useCallback(() => write([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    return { items, count, subtotal, hydrated, isOpen, open, close, add, setQuantity, remove, clear };
  }, [items, hydrated, isOpen, open, close, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart mora biti unutar CartProvider-a");
  return ctx;
}
