import { db } from "@/infra/db";
import { useLiveQuery } from "dexie-react-hooks";

export function useMetaVideos() {
  return useLiveQuery(() => db.meta.orderBy('createdAt').toArray());
}

export function useGetMetaByKey(key: string) {
  return useLiveQuery(() => db.meta.get(key), [key]);
}
