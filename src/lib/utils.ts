import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type NowOption<T extends "epoch" | "date"> = T extends "epoch" ? number : Date;

export function now<T extends "epoch" | "date">(as: T): NowOption<T> {
  const now = new Date();
  return as === "date" ? <NowOption<T>>now : <NowOption<T>>now.getTime();
}

export function uuidGen() {
  return crypto.randomUUID();
}

export function zeroPad(value: number | string, maxLength: number): string {
  return `${typeof value  === 'number' ? value.toFixed(0) : value}`.padStart(maxLength, "0");
}

export function createFillArray(size: number): Array<undefined> {
  return Array(size).fill(undefined);
}

export const parallels = (ps = new Set<Promise<unknown>>()) => ({
  add: (p: Promise<unknown>) =>
    ps.add(!!p.then(() => ps.delete(p)).catch(() => ps.delete(p)) && p),
  wait: (limit: number) => ps.size >= limit && Promise.race(ps),
  all: () => Promise.all(ps),
});

export function chunkArray<T>(array: T[], size: number): T[][] {
  return createFillArray(Math.ceil(array.length / size)).map((_, i) => {
    const start = i * size,
      end = start + size;
    return array.slice(start, end);
  });
}

export function toMmSs(timeAsSeconds: number): `${string}:${string}` {
  const minutes = Math.floor(timeAsSeconds / 60);
  const seconds = timeAsSeconds - minutes * 60;
  return `${zeroPad(minutes, 2)}:${zeroPad(seconds, 2)}`;
}
