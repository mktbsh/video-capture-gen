import { createDOM } from "./dom";
import { parallels, uuidGen } from "./utils";
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
  imageCallbackFn?: (image: CapturedImage) => void;
};

type CapturedImage = {
  file: File;
  height: number;
  width: number;
  time: number;
};

export function initVideoCaptureMachine({ src }: InitCaptureMachineOptions) {
  if (!src) throw new Error("No video source provided");
  const sessionId = uuidGen();
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

  function defaultFilenameFn(name: string): string {
    return `${sessionId}_${name}`;
  }

  function createTask(options: CaptureOption) {
    const { end, start, filenameFn } = options;
    const fn = filenameFn || defaultFilenameFn;
    const duration = Math.trunc(end - start);

    return Array(duration)
      .fill(undefined)
      .map((_, i) => {
        const time = start + i;
        const filename = fn(`${i.toFixed(0).padStart(6, "0")}s.webp`);
        return { time, filename };
      });
  }

  type StartWithCallbackOptions = Omit<CaptureOption, "imageCallbackFn"> &
    Required<Pick<CaptureOption, "imageCallbackFn">>;

  async function startWithCallback(
    options: StartWithCallbackOptions,
  ): Promise<void> {
    const tasks = createTask(options);
    const totalCount = tasks.length;
    let completedCount = 0;

    async function doTask(task: { time: number; filename: string }) {
      const image = await capture(task.time);
        const captureImage = {
          file: new File([image.blob], task.filename, { type: "image/webp" }),
          height: image.height,
          width: image.width,
          time: task.time,
        };

        completedCount++;

        options.progressFn?.((completedCount / totalCount) * 100);
        options.imageCallbackFn(captureImage);
    }

    const ps = parallels();
    for (const task of tasks) {
      ps.add(doTask(task));
      await ps.wait(1);
    }
    await ps.all();
  }

  async function start(
    options: Omit<CaptureOption, "imageCallbackFn">,
  ): Promise<CapturedImage[]> {
    const results: CapturedImage[] = [];

    await startWithCallback({
      ...options,
      imageCallbackFn: (image) => results.push(image),
    });

    destroy();

    return results;
  }

  return {
    capture,
    start,
    startWithCallback,
    destroy,
  };
}
