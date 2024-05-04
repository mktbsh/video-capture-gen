import { APP_NAME } from "@/const/site";
import Dexie, { Table } from "dexie";
import { Meta } from "./meta";
import { Capture, CaptureInsertModel } from "./capture";
import { now } from "@/lib/utils";
import { CapturedImage } from "@/lib/video-capture/types";
import { sha256 } from "@/lib/hash";

const DB_NAME = APP_NAME.split(" ").join("-").toLowerCase();
const DB_VERSION = 1;

class MyDb extends Dexie {
  meta!: Table<Meta>;
  captures!: Table<Capture>;

  constructor() {
    super(DB_NAME);
    this.version(DB_VERSION).stores({
      meta: "&key, title, createdAt, updatedAt",
      captures: "++id, key, time, createdAt",
    });
  }

  async insertCapture(capture: CapturedImage, videoKey: string) {
    const model = this.createCapture({
      videoKey,
      time: capture.time,
      data: capture.file
    });
    await this.captures.add(model);
    return capture;
  }

  async deleteCaptureById(id: number) {
    await db.captures.delete(id);
  }

  async deleteCapturesByVideoKey(videoKey: string) {
    const captures = await db.captures.where({ key: videoKey }).toArray();
    await Promise.all(
      captures.map((capture) => db.captures.delete(capture.id)),
    );
  }

  private createCapture(params: CaptureInsertModel): Capture {
    return {
      key: params.videoKey,
      time: params.time,
      createdAt: now("epoch"),
      data: params.data,
    };
  }

  async isMetaExist(key: string): Promise<boolean> {
    const meta = await this.meta.get(key);
    return meta !== undefined;
  }

  async saveNewMeta(meta: Meta): Promise<boolean> {
    await this.meta.add(meta);
    return true;
  }

  async insertMetaIfNotExist(meta: Meta): Promise<void> {
    const exist = await this.isMetaExist(meta.key);
    if (exist) return;
    await this.saveNewMeta(meta);
  }

  async updateMetaTitle(key: Meta["key"], newTitle: string) {
    return await this.meta.update(key, {
      title: newTitle,
      updatedAt: Date.now(),
    });
  }

  async deleteMetaByKey(key: string) {
    await this.meta.delete(key);
  }

  async createMeta(video: File): Promise<Meta> {
    const time = now('epoch');
    return {
      key: await sha256(video),
      title: video.name,
      createdAt: time,
      updatedAt: time,
    }
  }

  async deleteVideoByVideoKey(key: string) {
    await Promise.all([
      this.deleteMetaByKey(key),
      this.deleteCapturesByVideoKey(key)
    ])
  }
}

export const db = new MyDb();
