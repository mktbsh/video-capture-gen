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

type TransferOptions = {
  canvas: HTMLCanvasElement;
  video: HTMLVideoElement;
  convertTo?: "png" | "jpeg" | "webp";
  quality?: number;
};

const TRANSFER_CONST = {
  ctx: "2d",
  ERROR: "Failed to create blob from canvas",
};

type Transferred = {
  blob: Blob;
  width: number;
  height: number;
};

export function transferImage({
  canvas,
  video,
  convertTo = "png",
  quality = 1,
}: TransferOptions): Promise<Transferred> {
  const vh = video.videoHeight,
    vw = video.videoWidth;

  return new Promise<Transferred>((resolve, reject) => {
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0, vw, vh);

    const type = `image/${convertTo}`;
    const q = convertTo === "png" ? 1 : quality;

    canvas.toBlob(
      (blob) => {
        blob
          ? resolve({
              blob,
              height: vh,
              width: vw,
            })
          : reject(new Error(TRANSFER_CONST.ERROR));
      },
      type,
      q,
    );
  });
}
