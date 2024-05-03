import { createDOM } from "../dom";
import { TransferredImage, loadVideoMetadata, transferImage } from "../video";
import { CaptureOptions, CaptureTask, CapturedImage } from "./types";
import { parallels, toMmSs, uuidGen } from "../utils";
import { objectURL } from "../object-url";

type InitCapturerOptions = {
  source: Blob;
  id: string;
  sessionId?: string;
};

export type Capturer = {
  terminate: VoidFunction;
  run: (
    tasks: readonly CaptureTask[],
    callback: (image: CapturedImage) => void,
  ) => Promise<void>;
};

const EVT_SEEKED = "seeked";

export async function initCapturer(
  options: InitCapturerOptions,
): Promise<Capturer> {
  const id = options.id;

  const src = objectURL.create(options.source);

  const video = createDOM("video", (el) => {
    el.crossOrigin = "anonymous";
    el.muted = true;
    el.playsInline = true;
    el.preload = "metadata";
    el.src = src;
    el.load();
  });

  const metadata = await loadVideoMetadata(video);
  const canvas = createDOM("canvas", (el) => {
    el.width = metadata.width;
    el.height = metadata.height;
  });

  let isTerminated = false;

  function logger(message?: any) {
    console.log(`[Capturer#${id}] ${message}`);
  }

  function terminate() {
    if (isTerminated) return;
    const kill = (fn: VoidFunction) => new Promise((resolve) => resolve(fn()));
    objectURL.revoke(src);
    Promise.allSettled([kill(canvas.remove), kill(video.remove)]);
    isTerminated = true;
    logger("terminated");
  }

  function capture({ time, output }: CaptureTask): Promise<TransferredImage> {
    return new Promise((resolve) => {
      video.currentTime = time;

      const handleSeeked = async () => {
        await transferImage({ canvas, video, output }).then(resolve);
        logger(`captured: ${toMmSs(time)}`);
        video.removeEventListener(EVT_SEEKED, handleSeeked);
      };

      video.addEventListener(EVT_SEEKED, handleSeeked);
    });
  }

  async function doCapture(
    task: CaptureTask,
    callback: CaptureOptions["imageCallbackFn"],
  ): Promise<void> {
    const image = await capture(task);
    callback({
      file: new File([image.blob], task.filename, { type: image.type }),
      height: image.height,
      width: image.width,
      time: task.time,
    });
  }

  async function run(
    tasks: readonly CaptureTask[],
    callback: CaptureOptions["imageCallbackFn"],
  ) {
    if (isTerminated) throw new Error("Capturer is already terminated");

    logger("start");

    const ps = parallels();
    for (const task of tasks) {
      ps.add(doCapture(task, callback));
      await ps.wait(1);
    }
    await ps.all();
    terminate();
    logger("finish");
  }

  logger(`initialized: ${id}`);

  return {
    terminate,
    run,
  };
}
