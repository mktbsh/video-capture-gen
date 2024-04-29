import { createDOM } from "./dom";
import { TransferredImage, loadVideoMetadata, transferImage } from "./video";

type InitCaptureMachineOptions = {
  src: string;
};

type CaptureOption = {
  /**
   * unit: seconds
   */
  start: number;
  /**
   * unit: seconds
   */
  end: number;
  filenameFn?: (filename: string) => string;
  progressFn?: (progress: number) => void;
}

type CapturedImage = {
  file: File;
  height: number;
  width: number;
};

export function initVideoCaptureMachine({ src }: InitCaptureMachineOptions) {
  if (!src) throw new Error("No video source provided");
  const sessionId = crypto.randomUUID();
  const canvas = createDOM("canvas");
  const video = createDOM("video", (el) => {
    el.crossOrigin = "anonymous";
    el.muted = true;
    el.playsInline = true;
    el.preload = "metadata";
    el.src = src;
    el.load();
  });

  let loaded = false;

  async function load() {
    if (loaded) return;
    const { width, height } = await loadVideoMetadata(video);
    canvas.width = width;
    canvas.height = height;
    loaded = true;
  }

  load();

  async function capture(time: number): Promise<TransferredImage> {
    return new Promise((resolve) => {
      video.currentTime = time;

      async function handleSeeked() {
        !loaded && (await load());

        await transferImage({
          canvas,
          video,
          convertTo: "webp",
          quality: 0.85,
        }).then(resolve);

        video.removeEventListener("seeked", handleSeeked);
      }
      video.addEventListener("seeked", handleSeeked);
    });
  }

  function destroy() {
    URL.revokeObjectURL(video.src);
  }

  async function start(options: CaptureOption): Promise<CapturedImage[]> {
    const pfStart = performance.now();
    const { end, start, filenameFn, progressFn  } = options
    const duration = end - start;
    const results: CapturedImage[] = [];

    const _filenameFn = filenameFn
      ? filenameFn
      : (name: string) => `${sessionId}_${name}`;

    for (let i = 0; i < duration; i++) {
      const time = start + i;
      const image = await capture(time);

      const originalName = `${i.toFixed(0).padStart(6, "0")}s.webp`;
      const filename = _filenameFn(originalName);

      progressFn?.(i / duration * 100);
      results.push({
        file: new File([image.blob], filename, { type: "image/webp" }),
        height: image.height,
        width: image.width,
      });
    }

    destroy();

    const pfEnd = performance.now();

    console.info(`${sessionId}/start: ${pfEnd - pfStart}ms`);

    return results;
  }

  return {
    capture,
    start,
    destroy,
  };
}
