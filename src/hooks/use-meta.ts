import { dbInstance } from "@/infra/db";
import { useLiveQuery } from "dexie-react-hooks";

export function useMetaVideos() {
  return useLiveQuery(() => dbInstance.findAllVideoMeta());
}

export function useGetMetaByKey(key: string) {
  return useLiveQuery(() => dbInstance.findVideoMetaByKey(key), [key]);
}
