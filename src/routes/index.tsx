import { ContentLayout } from "@/components/content-layout";
import { ContentTitle } from "@/components/content-title";
import { FileUploader } from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { VideoView } from "@/components/video-view";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { usePageLogic } from "./-lib/use-page-logic";
import { Stats } from "./-components";
import { ACCEPT_FILE_TYPES, MAX_VIDEO_SIZE } from "./-const";
import { ImageTypeSelect } from "./-components/image-type-select";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  component: Page,
});

function Page() {
  const navigate = useNavigate({ from: "/" });

  const logic = usePageLogic();

  const state = logic.state;

  const hasVideo = state !== undefined;

  const handleClickStart = logic.registerCaptureHandlerFn({
    mode: "db",
    onCompleted: (key) => navigate({ to: "/v/$key", params: { key } }),
  });

  const actions = (
    <>
      <Button variant="destructive" onClick={logic.onReset}>
        Reset
      </Button>
    </>
  );

  return (
    <ContentLayout>
      <ContentLayout.Header actions={hasVideo ? actions : undefined}>
        <ContentTitle title="Local DB Mode" />
      </ContentLayout.Header>
      <div className="flex-1 bg-muted/50 mx-4 rounded-xl">
        <div className="w-full h-full grid place-items-center">
          {hasVideo ? (
            <div>
              <VideoView video={state.video} />
              {state.progress === undefined ? (
                <div className="flex gap-4">
                  <Slider
                    className="flex-1"
                    value={[state.startSec, state.endSec]}
                    max={state.videoDuration}
                    step={1}
                    onValueChange={logic.onChangeDuration}
                  />
                  <ImageTypeSelect currentValue={state.outputImageType} onChange={logic.onChangeImageType} />
                  {state.outputImageType !== "png" && (
                    <Input
                      type="number"
                      min={0.01}
                      max={1}
                      step="0.01"
                      value={state.outputImageQuality}
                      onChange={(e) => {
                        console.log(e.target.value)
                        logic.onChangeImageQuality(parseFloat(e.target.value));
                      }}
                      className="w-[90px]"
                    />
                  )}
                  <Button
                    className="ml-auto px-4 flex-shrink-0"
                    onClick={handleClickStart}
                  >
                    Start
                  </Button>
                </div>
              ) : (
                <div className="pt-4">
                  <Progress value={state.progress} />
                </div>
              )}

              <Stats timeStats={logic.stats} progress={state.progress} />
            </div>
          ) : (
            <FileUploader
              className="bg-white w-full"
              accept={ACCEPT_FILE_TYPES}
              onUpload={logic.onFileAccepted}
              maxSize={MAX_VIDEO_SIZE}
            />
          )}
        </div>
      </div>
    </ContentLayout>
  );
}
