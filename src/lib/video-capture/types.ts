import { OutputImage } from "../video";

export type InitCaptureMachineOptions = {
  src: Blob;
  captureStart: number;
  captureEnd: number;
  filenameFn?: (filename: string) => string;
  outputOptions: OutputImage
};

export type CaptureOptions = {
  progressFn?: (progress: number) => void;
  imageCallbackFn: (image: CapturedImage) => void;
};

export type CapturedImage = {
  file: File;
  height: number;
  width: number;
  time: number;
};

export type InitCapturerOptions = {
  source: string;
  sessionId: string;
  outputOptions: OutputImage
  tasks: CaptureTask[];
}

export type CaptureTask = {
  time: number;
  filename: string;
  output: OutputImage
}
