import { Capture } from "@/infra/db/capture";
import { useObjectURL } from "@/hooks/use-object-url";

type Props = {
  capture: Capture;
};

export function CaptureView({ capture }: Props) {
  const { url } = useObjectURL(capture.data);

  return (
    <img
      src={url}
      alt=""
      decoding="async"
      className="w-auto h-full pointer-events-none object-cover"
    />
  );
}
