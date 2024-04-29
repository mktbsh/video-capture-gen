import { transferImage } from "./video";

const TIMEOUT_MS_SEEKED = 100;

export class Vtg {
  private readonly video: HTMLVideoElement;
  private canvas: HTMLCanvasElement;
  private blobs: Blob[] = [];
  private readonly videoSrc: string;
  constructor(videoSrc: string) {
    this.video = document.createElement("video");
    this.canvas = document.createElement("canvas");
    this.video.crossOrigin = "anonymous";
    this.videoSrc = videoSrc;
    if (!this.videoSrc) {
      throw new Error("No video source provided");
    }
  }

  private drawThumbnailAtTime(
    time: number
  ): Promise<{ width: number; height: number; blob: Blob }> {
    return new Promise((resolve) => {
      this.video.currentTime = time;

      const onSeeked = () => {
        setTimeout(() => {
          transferImage({
            canvas: this.canvas,
            video: this.video,
            convertTo: 'webp',
            quality: 0.85
          }).then(data => resolve(data))
          this.video.removeEventListener("seeked", onSeeked);
        }, TIMEOUT_MS_SEEKED);
      };
      this.video.addEventListener("seeked", onSeeked);
    });
  }

  private initVideo() {
    this.video.muted = true;
    this.video.playsInline = true;
    this.video.preload = "metadata";
    this.video.src = this.videoSrc;
    this.video.load();
  }

  private addListener(
    resolve: (value: void) => void,
    reject: (reason?: unknown) => void
  ) {
    const onLoadMetaData = () => {
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;
      resolve();
      this.video.removeEventListener("loadedmetadata", onLoadMetaData);
      this.video.removeEventListener("error", onError);
    };

    const onError = () => {
      reject(
        new Error(
          "Error loading video (codec might not be supported by this browser)"
        )
      );
      this.video.removeEventListener("loadedmetadata", onLoadMetaData);
      this.video.removeEventListener("error", onError);
    };

    this.video.addEventListener("loadedmetadata", onLoadMetaData);
    this.video.addEventListener("error", onError);
  }

  public async generateThumbnails(
    numFrames: number
  ): Promise<{ width: number; height: number; blob: Blob }[]> {
    this.initVideo();
    await new Promise((resolve, reject) => this.addListener(resolve, reject));
    const thumbnails = [];
    const duration = this.video.duration;
    const interval = duration / numFrames;
    for (let i = 0; i < numFrames; i++) {
      const time = i * interval;
      thumbnails.push(await this.drawThumbnailAtTime(time));
    }

    return thumbnails;
  }

  public async getThumbnail(
    framePosition: "start" | "middle" | "end" | number = "middle",
    seconds?: boolean
  ): Promise<{
    width: number;
    height: number;
    blob: Blob;
  }> {
    this.initVideo();
    await new Promise((resolve, reject) => this.addListener(resolve, reject));
    let time = 0;
    if (typeof framePosition === "number") {
      time = seconds
        ? framePosition
        : (this.video.duration * framePosition) / 100;
    } else {
      switch (framePosition) {
        case "start":
          time = Math.min(0.1, this.video.duration);
          break;
        case "middle":
          time = this.video.duration / 2;
          break;
        case "end":
          time = this.video.duration;
          break;
      }
    }
    return this.drawThumbnailAtTime(time);
  }

  public revokeUrls(): void {
    this.blobs = [];
    URL.revokeObjectURL(this.videoSrc);
  }
}
