import { now } from "@/lib/utils";
import { db } from "./_db";

export type Capture = {
  id?: number;
  key: string;
  time: number;
  createdAt: number;
  data: File;
};

type CoreParams<T> = {
  videoKey: string;
} & T;

export type CaptureInsertModel = CoreParams<{
  time: number;
  data: File;
}>;

function createCapture(params: CaptureInsertModel): Capture {
  return {
    key: params.videoKey,
    time: params.time,
    createdAt: now("epoch"),
    data: params.data,
  }
}

export async function saveNewCapture(params: CaptureInsertModel): Promise<Capture> {
  const capture = createCapture(params);
  await db.captures.add(capture);
  return capture;
}

export async function deleteCaptureByID(id: number) {
  await db.captures.delete(id);
}

export async function deleteCapturesByKey({ videoKey }: CoreParams<unknown>) {
  const captures = await db.captures.where({ key: videoKey }).toArray();
  await Promise.all(
    captures.map((capture) => db.captures.delete(capture.id)),
  );
}


