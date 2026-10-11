import type { z } from "zod";

export interface ActionState {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export function fieldErrorsOf(issues: z.ZodIssue[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const i of issues) {
    const key = String(i.path[0] ?? "");
    if (key && !out[key]) out[key] = i.message;
  }
  return out;
}

export function invalid(issues: z.ZodIssue[]): ActionState {
  return { error: "Proverite označena polja.", fieldErrors: fieldErrorsOf(issues) };
}

export const str = (fd: FormData, name: string) => String(fd.get(name) ?? "").trim();
export const bool = (fd: FormData, name: string) => fd.get(name) === "1";
export const num = (fd: FormData, name: string) => {
  const v = str(fd, name).replace(",", ".");
  return v === "" ? undefined : Number(v);
};
export const jsonArray = (fd: FormData, name: string): string[] => {
  try {
    const v = JSON.parse(str(fd, name) || "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
};
export const lines = (fd: FormData, name: string): string[] =>
  str(fd, name).split("\n").map((l) => l.trim()).filter(Boolean);
