import { db } from "@/infra/db";

export async function insertCapture(key: string, data: File) {
  await db.captures.add({
    key,
    data,
    createdAt: Date.now(),
  })
}
