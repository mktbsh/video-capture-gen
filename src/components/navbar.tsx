import { useMetaVideos } from "@/usecase/use-meta";
import { Link } from "@tanstack/react-router";
import { ChevronRightIcon, Search } from "lucide-react";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { useMemo, useState } from "react";

export function NavBar() {
  const [search, setSearch] = useState("");
  const videos = useMetaVideos();

  const filtered = useMemo(() => {
    const data = videos || [];
    return data.filter((v) => v.title.includes(search));
  }, [search, videos]);

  return (
    <div className="h-full p-4 space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search videos..."
          className="pl-8 ring-1 ring-gray-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ScrollArea className="h-full w-full pb-2 space-y-2">
        {filtered.map((video) => (
          <Link
            key={video.key}
            to="/v/$key"
            params={{ key: video.key }}
            className="flex items-center justify-between px-2 py-1 rounded-lg [&.active]:bg-yellow-200 hover:bg-yellow-200"
          >
            <span className="text-sm text-yellow-900">{video.title}</span>
            <ChevronRightIcon className="h-5 w-5 text-yellow-500" />
          </Link>
        ))}
      </ScrollArea>
    </div>
  );
}
