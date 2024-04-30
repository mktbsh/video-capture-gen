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

type SaveParams = CoreParams<{
  time: number;
  data: File;
}>;

export async function saveNewCapture({
  data,
  time,
  videoKey,
}: SaveParams): Promise<Capture> {
  const capture: Capture = {
    key: videoKey,
    time,
    createdAt: now("epoch"),
    data,
  };

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


