import { Capture } from "@/infra/db/capture";
import { useObjectURL } from "@/hooks/use-object-url";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  capture: Capture;
};

export function CaptureView({ capture }: Props) {
  const { url } = useObjectURL(capture.data);

  return (
    <Dialog>
      <DialogTrigger>
        <img
          src={url}
          alt=""
          decoding="async"
          className="w-auto h-full pointer-events-none object-cover"
        />
      </DialogTrigger>
      <DialogContent className="md:min-w-[720px] lg:min-w-[968px] xl:min-w-[1080px]">
          <DialogHeader>
            <DialogTitle>{capture.data.name}</DialogTitle>
          </DialogHeader>
          <img
            src={url}
            alt=""
            decoding="async"
            className="w-auto h-full pointer-events-none object-cover"
          />
      </DialogContent>
    </Dialog>
  );
}
