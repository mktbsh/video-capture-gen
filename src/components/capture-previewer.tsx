import { useCapturesByVideoKey } from "@/usecase/use-captures";

type Props = {
  videoKey?: string;
}

export function CapturePreviewer({ videoKey }: Props) {
  const queryResult = useCapturesByVideoKey(videoKey || "");
  const captures = queryResult || [];

  return (
    <ul className="h-52 max-w-full p-4 gap-2 overflow-y-auto bg-muted/50 mx-4 rounded-xl">
      {/* {captures.map((v) => (
        <CaptureView key={v.key + v.id} capture={v} />
      ))} */}
      {captures.map((capture) => (
        <li key={capture.key + capture.id}>{capture.id}</li>
      ))}
    </ul>
  );
}
