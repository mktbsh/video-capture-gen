import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type NowOption<T extends "epoch" | "date"> = T extends "epoch" ? number : Date

export function now<T extends "epoch" | "date">(as: T): NowOption<T> {
  const now = new Date();
  return as === "date" ? <NowOption<T>>now : <NowOption<T>>now.getTime();
}

export function uuidGen() {
  return crypto.randomUUID();
}

export const parallels = (ps = new Set<Promise<unknown>>()) => ({
  add: (p: Promise<unknown>) =>
    ps.add(!!p.then(() => ps.delete(p)).catch(() => ps.delete(p)) && p),
  wait: (limit: number) => ps.size >= limit && Promise.race(ps),
  all: () => Promise.all(ps),
});
