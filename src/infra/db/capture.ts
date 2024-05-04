export type Capture = {
  id?: number;
  key: string;
  time: number;
  createdAt: number;
  data: File;
};

type CoreParams<T> = {
  videoKey: string;
} & T;

export type CaptureInsertModel = CoreParams<{
  time: number;
  data: File;
}>;
