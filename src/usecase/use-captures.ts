import { db } from "@/infra/db";
import { useLiveQuery } from "dexie-react-hooks";

export function useCapturesByVideoKey(key: string) {
  return useLiveQuery(() => key ? db.captures.where({ key }).sortBy("createdAt") : [], [key]);
}

