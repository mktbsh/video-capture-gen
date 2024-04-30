import { deleteCapturesByKey } from "./capture";
import { deleteMetaByKey } from "./meta";


export async function deleteVideoByVideoKey(key: string) {
  await Promise.all([
    deleteMetaByKey(key),
    deleteCapturesByKey({ videoKey: key })
  ])
}
