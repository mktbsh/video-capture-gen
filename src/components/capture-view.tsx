import { Capture } from "@/infra/db/capture";
import { useObjectURL } from "@/lib/use-object-url";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

type Props = {
  capture: Capture;
};

export function CaptureView({ capture }: Props) {
  const { url } = useObjectURL(capture.data);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    let url: string = '';

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && imgRef.current) {
        const img = imgRef.current;
        url = URL.createObjectURL(capture.data);
        img.src = url;
        img.decoding = "async";
        img.onload = () => setIsLoaded(true);
        observer.disconnect();
      }
    });

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
      url && URL.revokeObjectURL(url);
    }
  }, [capture.data]);

  return (
    <img
      ref={imgRef}
      src={url}
      alt=""
      data-id={capture.id}
      data-created-at={capture.createdAt}
      className={cn("w-auto h-full pointer-events-none object-cover", isLoaded ? "opacity-100" : "opacity-0")}
    />
  );
}
