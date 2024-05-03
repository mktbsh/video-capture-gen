import { useObjectURL } from "@/hooks/use-object-url";

type Props = {
  video: File;
}

export function VideoView({ video }: Props) {
  const { url } = useObjectURL(video);

  return <video className="w-full h-auto max-h-[540px]" src={url} autoPlay muted loop controls />;
}
