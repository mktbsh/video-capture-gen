import { Capture, db } from "@/infra/db";
import { fileDownload, fileSize } from "@/lib/file";
import { uuidGen } from "@/lib/utils";
import { compressZip } from "@/lib/zip";
import { useNavigate } from "@tanstack/react-router";

export function usePageLogic() {
  const navigate = useNavigate({ from: "/v/$key" });

  function registerEditTitleFn(videoKey: string) {
    return function handleEditTitle(newTitle: string) {
      return db.updateMetaTitle(videoKey, newTitle);
    };
  }

  function registerDeleteVideoFn(videoKey: string) {
    return async function handleDelete() {
      await navigate({
        to: "/",
        replace: true,
      });
      db.deleteVideoByVideoKey(videoKey);
    };
  }

  function registerDownloadZipFn(captures: readonly Capture[]) {
    return async function handleDownloadZip() {
      const file = await compressZip(
        captures.map((v) => v.data),
        `${uuidGen()}.zip`,
      );
      fileDownload({ file });
    };
  }

  function toFileSizeText(size: number): string {
    return fileSize({ source: size, digit: 2 });
  }

  return {
    registerEditTitleFn,
    registerDeleteVideoFn,
    registerDownloadZipFn,
    toFileSizeText
  };
}
