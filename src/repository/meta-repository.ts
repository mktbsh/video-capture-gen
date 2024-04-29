import { db } from "@/infra/db";
import { Meta } from "@/infra/db/meta";
import { sha256 } from "@/lib/hash";


async function createMeta(video: File): Promise<Meta> {
  const now = Date.now();
  return {
    key: await sha256(video),
    title: video.name,
    createdAt: now,
    updatedAt: now,
  };
}

async function isMetaExist(key: string): Promise<boolean> {
  const meta = await db.meta.get(key);
  return meta !== undefined;
}

async function saveNewMeta(meta: Meta): Promise<boolean> {
  await db.meta.add(meta);
  return true;
}

async function updateMetaTitle(key: Meta["key"], newTitle: string) {
  return await db.meta.update(key, {
    title: newTitle,
    updatedAt: Date.now(),
  })
}

export { createMeta, saveNewMeta, updateMetaTitle, isMetaExist };
