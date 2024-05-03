import { chunkArray, createFillArray, uuidGen, zeroPad } from "../utils";
import { initCapturer } from "./capturer";
import {
  CaptureOptions,
  CaptureTask,
  CapturedImage,
  InitCaptureMachineOptions,
} from "./types";

const MAX_THREAD = 4;

const THREAD_THRESHOLD = 100;

const isEven = (n: number) => n % 2 === 0;

function maxTaskSizeInThread(duration: number): number {
  if (duration < THREAD_THRESHOLD) return duration;
  const v = isEven(duration) ? duration + 2 : duration + 3;
  return Math.ceil(v / MAX_THREAD);
}

export function initVideoCaptureMachine({
  captureEnd,
  captureStart,
  filenameFn,
  src,
  outputOptions,
}: InitCaptureMachineOptions) {
  if (!src) throw new Error("No video source provided");

  const state = {
    sessionId: uuidGen(),
    start: captureStart,
    end: captureEnd,
    duration: Math.trunc(captureEnd - captureStart),
  };

  console.group(state.sessionId);

  function logger(message?: any) {
    console.log(message);
  }

  function metrics() {
    const start = performance.now();
    const finish = () => {
      logger(`task completed: ${performance.now() - start}ms`);
    };

    return {
      finish,
    };
  }

  function initWorker(id: string) {
    return initCapturer({ id, source: src, sessionId: state.sessionId });
  }

  function destroy() {
    console.groupEnd();
  }

  function toFilename(name: string) {
    return filenameFn?.(name) || `${state.sessionId}_${name}`;
  }

  function createTasks(): CaptureTask[] {
    return createFillArray(state.duration).map((_, i) => ({
      time: state.start + i,
      filename: toFilename(`${zeroPad(i, 6)}s.${outputOptions.type}`),
      output: outputOptions,
    }));
  }

  async function handleTasks(
    id: string,
    tasks: CaptureTask[],
    cb: CaptureOptions["imageCallbackFn"],
  ) {
    const capturer = await initWorker(id);
    await capturer.run(tasks, cb).finally(capturer.terminate);
  }

  async function run(options: CaptureOptions) {
    const { finish } = metrics();
    const tasks = createTasks();
    logger(`task created: ${tasks.length} tasks`);

    const totalCount = tasks.length;
    let completedCount = 0;

    const chunkSize = maxTaskSizeInThread(state.duration);

    const chunkedTasks = chunkArray(tasks, chunkSize);

    logger(`threads count: ${chunkedTasks.length}`);

    await Promise.allSettled(
      chunkedTasks.map((v, i) =>
        handleTasks(zeroPad(i, 2), v, (image) => {
          completedCount++;
          options.progressFn?.((completedCount / totalCount) * 100);
          options.imageCallbackFn(image);
        }),
      ),
    );

    destroy();
    finish();
  }

  async function getResultAsArray(
    progressFn?: CaptureOptions["progressFn"],
  ): Promise<CapturedImage[]> {
    const results: CapturedImage[] = [];

    await run({
      progressFn,
      imageCallbackFn: (image) => results.push(image),
    });

    return results;
  }

  return {
    run,
    getResultAsArray,
  };
}
