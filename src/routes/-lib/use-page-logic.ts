import {
  createMeta,
  insertMetaIfNotExist,
  saveNewCapture,
} from "@/infra/db";
import { sha256 } from "@/lib/hash";
import { uuidGen } from "@/lib/utils";
import { OutputImage, getDurationFromVideo } from "@/lib/video";
import { initVideoCaptureMachine } from "@/lib/video-capture";
import { useMemo, useState } from "react";

type PageState = {
  video: File;
  key: string;
  videoDuration: number;
  startSec: number;
  endSec: number;
  progress?: number;
  outputImageType: OutputImage["type"];
  outputImageQuality: OutputImage["quality"];
};

type CaptureHandlerOptions = {
  mode: "db";
  onCompleted: (videoKey: string) => void;
} | {
  mode: "zip";
  onCompleted: (zip: File) => void;
}

export function usePageLogic() {
  const [state, setState] = useState<PageState>();

  const stats = useMemo(() => {
    if (!state) return [];
    const { endSec, startSec } = state;
    return [
      {
        label: "Start",
        value: startSec,
      },
      {
        label: "End",
        value: endSec,
      },
      {
        label: "Duration",
        value: endSec - startSec,
      },
    ]

  }, [state])

  function updateProgress(progress: number) {
    setState((prev) => {
      if (!prev) return undefined;
      return {
        ...prev,
        progress,
      };
    });
  }

  async function onFileAccepted(files: File[]) {
    const [file] = files;
    if (!file) return;

    const duration = await getDurationFromVideo(file);
    setState({
      video: file,
      key: await sha256(file),
      videoDuration: duration,
      startSec: 0,
      endSec: duration,
      outputImageType: "png",
      outputImageQuality: 1,
    });
  }

  function onReset() {
    setState(undefined);
  }

  function safetySetState(fn: (prev: PageState) => PageState) {
    setState((prev) => {
      if (!prev) return undefined;
      return fn(prev);
    })
  }

  function onChangeDuration([start, end]: number[]) {
    safetySetState((prev) => ({
      ...prev,
      startSec: start,
      endSec: end,
    }))
  }

  function onChangeImageType(type: OutputImage["type"]) {
    safetySetState((prev) => ({
      ...prev,
      outputImageType: type,
    }))
  }

  function onChangeImageQuality(q: number) {
    safetySetState((prev) => ({
      ...prev,
      outputImageQuality: q,
    }))
  }

  function registerCaptureHandlerFn({ mode, onCompleted }: CaptureHandlerOptions) {
    if (!state) return undefined;

    return async function onCapture() {
      const machine = initVideoCaptureMachine({
        src: state.video,
        captureEnd: state.endSec,
        captureStart: state.startSec,
        outputOptions: {
          type: state.outputImageType,
          quality: state.outputImageQuality
        },
      });

      if (mode === "db") {
        createMeta(state.video).then(insertMetaIfNotExist);
        await machine.run({
          progressFn: updateProgress,
          imageCallbackFn(image) {
            saveNewCapture({
              videoKey: state.key,
              time: image.time,
              data: image.file,
            });
          },
        });
        onCompleted(state.key);
      } else {
        const zip = await machine.getResultAsZip(`${uuidGen()}.zip`, updateProgress);
        onCompleted(zip);
        onReset()
      }
    }
  }

  return {
    state,
    stats,
    onChangeDuration,
    onChangeImageType,
    onChangeImageQuality,
    onFileAccepted,
    onReset,
    registerCaptureHandlerFn
  };
}
