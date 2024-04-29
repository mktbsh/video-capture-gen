import { db } from "@/infra/db";
import { useLiveQuery } from "dexie-react-hooks";

export function useCapturesByVideoKey(key: string) {
  const data = useLiveQuery(() => key ? db.captures.where({ key }).sortBy("createdAt") : [], [key]);
  const captures = data || [];

  return {
    captures,
    totalSize: captures.reduce((total, capture) => total + capture.data.size, 0)
  }
}
