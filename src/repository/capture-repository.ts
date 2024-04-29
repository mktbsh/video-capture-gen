import { db } from "@/infra/db";

export async function insertCapture(key: string, data: Blob) {
  await db.captures.add({
    key,
    data,
    createdAt: Date.now(),
  })
}
