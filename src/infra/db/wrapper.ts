import { now } from "@/lib/utils";
import { db } from "./_db";
import { Capture, CaptureInsertModel } from "./capture";
import { Meta } from "./meta";
import { sha256 } from "@/lib/hash";
import { CapturedImage } from "@/lib/video-capture/types";

export function dbWrapper() {
  async function insertCapture(capture: CapturedImage, videoKey: string) {
    const model = createCapture({
      videoKey,
      time: capture.time,
      data: capture.file
    });
    await db.captures.add(model);
    return capture;
  }

  function deleteCaptureById(id: number) {
    return db.captures.delete(id);
  }

  async function deleteCapturesByVideoKey(videoKey: string) {
    const captures = await db.captures.where({ key: videoKey }).toArray();
    await Promise.all(
      captures.map((capture) => db.captures.delete(capture.id)),
    );
  }

  function createCapture(params: CaptureInsertModel): Capture {
    return {
      key: params.videoKey,
      time: params.time,
      createdAt: now("epoch"),
      data: params.data,
    };
  }

  async function saveNewMeta(meta: Meta): Promise<boolean> {
    await db.meta.add(meta);
    return true;
  }

  async function insertMetaIfNotExist(meta: Meta): Promise<void> {
    const exist = await db.meta.get(meta.key);
    if (exist) return;
    await saveNewMeta(meta);
  }

  async function updateMetaTitle(key: Meta["key"], newTitle: string) {
    return await db.meta.update(key, {
      title: newTitle,
      updatedAt: Date.now(),
    });
  }

  async function deleteMetaByKey(key: string) {
    await db.meta.delete(key);
  }

  async function createMeta(video: File): Promise<Meta> {
    const time = now('epoch');
    return {
      key: await sha256(video),
      title: video.name,
      createdAt: time,
      updatedAt: time,
    }
  }

  async function deleteVideoByVideoKey(key: string) {
    await Promise.all([
      deleteMetaByKey(key),
      deleteCapturesByVideoKey(key)
    ])
  }

  async function findCapturesByKey(key?: string) {
    return key ? db.captures.where({ key }).sortBy("time") : []
  }

  async function findAllVideoMeta() {
    return db.meta.orderBy('createdAt').toArray() || [];
  }

  async function findVideoMetaByKey(key: string) {
    return db.meta.get(key)
  }

  return  {
    createMeta,
    deleteCaptureById,
    deleteVideoByVideoKey,
    findAllVideoMeta,
    findVideoMetaByKey,
    findCapturesByKey,
    insertCapture,
    insertMetaIfNotExist,
    updateMetaTitle,
  }
}

export const dbInstance = dbWrapper()
