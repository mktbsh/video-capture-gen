import { CaptureView } from "./capture-view";
import { Capture } from "@/infra/db/capture";

type Props = {
  captures: readonly Capture[];
}

export function CaptureGrid({ captures }: Props) {
  return (
    <div className="h-full w-full overflow-y-auto grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 p-4">
       {captures.map((v) => (
        <CaptureView key={v.key + v.id} capture={v} />
      ))}
    </div>
  );
}
