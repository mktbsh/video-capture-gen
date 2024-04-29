import { db } from "@/infra/db";

export async function deleteByVideoKey(key: string) {
  await db.meta.delete(key);
  const captures = await db.captures.where({ key }).toArray();
  await Promise.all(captures.map(async (capture) => {
    await db.captures.delete(capture.id)
  }))
}
