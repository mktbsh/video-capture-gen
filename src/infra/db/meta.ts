import { now } from "@/lib/utils";
import { db } from "./_db";
import { sha256 } from "@/lib/hash";


export type Meta = {
  key: string;
  title: string;
  createdAt: number;
  updatedAt: number;
};


async function createMeta(video: File): Promise<Meta> {
  const time = now('epoch')
  return {
    key: await sha256(video),
    title: video.name,
    createdAt: time,
    updatedAt: time,
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

async function deleteMetaByKey(key: string) {
  await db.meta.delete(key);
}

export { createMeta, saveNewMeta, updateMetaTitle, isMetaExist, deleteMetaByKey };
