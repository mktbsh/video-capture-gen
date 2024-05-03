import { OutputImage } from "@/lib/video";

const GIB = 1024 * 1024 * 1024;

export const ACCEPT_FILE_TYPES = {
  "video/*": [],
}

export const MAX_VIDEO_SIZE = GIB * 2;

export const DEFAULT_OUTPUT_TYPE = {
  type: "webp",
  quality: 0.85
} as const satisfies OutputImage;
