import { useObjectURL } from "@/lib/use-object-url";

type Props = {
  video: File;
}

export function VideoView({ video }: Props) {
  const { url } = useObjectURL(video);

  return <video className="w-full h-auto" src={url} autoPlay muted loop controls />;
}
