import { ContentLayout } from "@/components/content-layout";
import { ContentTitle } from "@/components/content-title";
import { FileUploader } from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { VideoView } from "@/components/video-view";
import { saveNewCapture } from "@/infra/db";
import { sha256 } from "@/lib/hash";
import { cn } from "@/lib/utils";
import { getDurationFromVideo } from "@/lib/video";
import { initVideoCaptureMachine } from "@/lib/video-capture";
import {
  createMeta,
  isMetaExist,
  saveNewMeta,
} from "@/infra/db";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Page,
});

type PageState = {
  video: File;
  key: string;
  videoDuration: number;
  startSec: number;
  endSec: number;
  progress?: number;
};

function Page() {
  const [state, setState] = useState<PageState>();

  const navigate = useNavigate({ from: "/" });

  const hasVideo = state !== undefined;

  async function handleFileAccepted([file]: File[]) {
    if (!file) return;
    const duration = await getDurationFromVideo(file);
    setState({
      video: file,
      key: await sha256(file),
      videoDuration: duration,
      startSec: 0,
      endSec: duration,
    });
  }

  function handleReset() {
    setState(undefined);
  }

  function updateProgress(progress: number) {
    setState((prev) => {
      if (!prev) return undefined;
      return {
        ...prev,
        progress,
      };
    });
  }

  async function handleStart() {
    if (!state) return;
    const { startWithCallback } = initVideoCaptureMachine({
      src: URL.createObjectURL(state.video),
    });

    const exist = await isMetaExist(state.key);
    if (!exist) {
      const meta = await createMeta(state.video);
      await saveNewMeta(meta);
    }


    await startWithCallback({
      start: state.startSec,
      end: state.endSec,
      progressFn: updateProgress,
      imageCallbackFn(image) {
        saveNewCapture({
          videoKey: state.key,
          time: image.time,
          data: image.file
        });
      },
    })

    navigate({
      to: "/v/$key",
      params: {
        key: state.key,
      },
    });
  }

  const actions = (
    <>
      <Button variant="destructive" onClick={handleReset}>
        Reset
      </Button>
    </>
  );

  return (
    <ContentLayout>
      <ContentLayout.Header actions={hasVideo ? actions : undefined}>
        <ContentTitle title={state?.video.name || ""} />
      </ContentLayout.Header>
      <div className="flex-1 bg-muted/50 mx-4 rounded-xl">
        <div className="w-full h-full grid place-items-center p-4">
          {hasVideo ? (
            <div className="space-y-2">
              <VideoView video={state.video} />
              {state.progress === undefined ? (
                <div className="flex gap-4">
                  <Slider
                    className="flex-1"
                    value={[state.startSec, state.endSec]}
                    max={state.videoDuration}
                    step={1}
                    onValueChange={([start, end]) => {
                      setState((prev) => {
                        if (!prev) return undefined;
                        return {
                          ...prev,
                          startSec: start,
                          endSec: end,
                        };
                      });
                    }}
                  />
                  <Button
                    className="ml-auto px-4 flex-shrink-0"
                    onClick={handleStart}
                  >
                    Start
                  </Button>
                </div>
              ) : (
                <div className="pt-4">
                <Progress value={state.progress} />
              </div>
              )}

              <dl
                className={cn(
                  "pt-3 grid gap-5",
                  state.progress !== undefined ? "grid-cols-4" : "grid-cols-3",
                )}
              >
                <Stat label="Start" time={state.startSec} />
                <Stat label="End" time={state.endSec} />
                <Stat label="Duration" time={state.endSec - state.startSec} />
                {state.progress !== undefined && (
                  <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">
                      Progress
                    </dt>
                    <dd className="mt-1 text-2xl lg:text-3xl font-semibold tracking-tight text-gray-900">
                      {state.progress.toFixed(0)}%
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          ) : (
            <FileUploader
              className="bg-white w-full"
              accept={{
                "video/webm": [],
                "video/mp4": [],
              }}
              onUpload={handleFileAccepted}
              maxSize={1024 * 1024 * 1024 * 1.5}
            />
          )}
        </div>
      </div>
    </ContentLayout>
  );
}

type Props = {
  label: string;
  time: number;
};

const zeroPad = (value: number): string => value.toFixed(0).padStart(2, "0");

function Stat({ label, time }: Props) {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;

  const text = `${zeroPad(minutes)}:${zeroPad(seconds)}`;

  return (
    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
      <dt className="truncate text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-2xl lg:text-3xl font-semibold tracking-tight text-gray-900">
        {text}
      </dd>
    </div>
  );
}
