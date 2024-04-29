import { useCapturesByVideoKey } from "@/usecase/use-captures";
import { CaptureView } from "./capture-view";

type Props = {
  videoKey: string;
}

export function CaptureGrid({ videoKey }: Props) {
  const queryResult = useCapturesByVideoKey(videoKey);
  const captures = queryResult || [];

  return (
    <div className="h-full w-full overflow-y-auto grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 p-4">
       {captures.map((v) => (
        <CaptureView key={v.key + v.id} capture={v} />
      ))}
    </div>
  );
}
