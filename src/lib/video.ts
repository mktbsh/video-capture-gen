type VideoMetadata = {
  height: number;
  width: number;
  duration: number;
};

const ERR_LOAD_METADATA =
  "Error loading video (codec might not be supported by this browser)";

export function loadVideoMetadata(
  video: HTMLVideoElement,
): Promise<VideoMetadata> {
  const event = "loadedmetadata";
  return new Promise<VideoMetadata>((resolve, reject) => {
    function handleLoadMetadata() {
      resolve({
        height: video.videoHeight,
        width: video.videoWidth,
        duration: video.duration,
      });

      video.removeEventListener(event, handleLoadMetadata);
      video.removeEventListener("error", handleError);
    }

    function handleError() {
      reject(new Error(ERR_LOAD_METADATA));
      video.removeEventListener(event, handleLoadMetadata);
      video.removeEventListener("error", handleError);
    }

    video.addEventListener(event, handleLoadMetadata);
    video.addEventListener("error", handleError);
    video.load();
  });
}

export function getDurationFromVideo(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);

    const video = document.createElement("video");
    video.src = url;

    video.addEventListener("loadedmetadata", () => {
      resolve(video.duration);
      URL.revokeObjectURL(url);
    });

    video.addEventListener("error", () => {
      reject(new Error("Failed to load video"));
      URL.revokeObjectURL(url);
    });
  });
}

export type OutputImage =
  | { type: "png" }
  | { type: "jpeg"; quality: number }
  | { type: "webp"; quality: number };

type TransferOptions = {
  canvas: HTMLCanvasElement;
  video: HTMLVideoElement;
  output: OutputImage;
};

const TRANSFER_CONST = {
  ctx: "2d",
  ERROR: "Failed to create blob from canvas",
};

export type TransferredImage = {
  blob: Blob;
  width: number;
  height: number;
  type: string;
};

export function transferImage({
  canvas,
  video,
  output = { type: "png" },
}: TransferOptions): Promise<TransferredImage> {
  const height = video.videoHeight,
    width = video.videoWidth;

  return new Promise<TransferredImage>((resolve, reject) => {
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0, width, height);

    const type = `image/${output.type}`;
    const q = output.type === "png" ? 1 : output.quality;

    const toBlob = (blob: Blob | null) => {
      if (blob) {
        resolve({ blob, width, height, type });
      } else {
        reject(new Error(TRANSFER_CONST.ERROR));
      }
    };

    canvas.toBlob(toBlob, type, q);
  });
}
