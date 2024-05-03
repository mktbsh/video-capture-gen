import { useMetaVideos } from "@/hooks/use-meta";
import { Link } from "@tanstack/react-router";
import { ChevronRightIcon, Search } from "lucide-react";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export function NavBar() {
  const [search, setSearch] = useState("");
  const videos = useMetaVideos();

  const filtered = useMemo(() => {
    const data = videos || [];
    return data.filter((v) => v.title.includes(search));
  }, [search, videos]);

  return (
    <div className="h-full p-4 space-y-2">
      <Link
        to="/"
        className="flex items-center justify-between p-2 rounded-lg [&.active]:bg-yellow-200 hover:bg-yellow-200"
      >
        <span className="text-sm text-yellow-900">Local DB Mode</span>
        <ChevronRightIcon className="h-5 w-5 text-yellow-500 flex-shrink-0" />
      </Link>
      <Link
        to="/zip"
        className="flex items-center justify-between p-2 rounded-lg [&.active]:bg-yellow-200 hover:bg-yellow-200"
      >
        <span className="text-sm text-yellow-900">ZIP File Mode</span>
        <ChevronRightIcon className="h-5 w-5 text-yellow-500 flex-shrink-0" />
      </Link>
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search videos..."
          className="pl-8 ring-1 ring-gray-50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ScrollArea className="h-full w-full pb-2 space-y-2">
        {filtered.map((video, index) => (
          <Link
            key={video.key}
            to="/v/$key"
            params={{ key: video.key }}
            className={cn(
              "flex items-center justify-between p-2 rounded-lg [&.active]:bg-yellow-200 hover:bg-yellow-200",
              index > 0 && "mt-2",
            )}
          >
            <span className="text-sm text-yellow-900">
              {video.title.substring(0, 22)}
              {video.title.length > 22 ? "..." : ""}
            </span>
            <ChevronRightIcon className="h-5 w-5 text-yellow-500 flex-shrink-0" />
          </Link>
        ))}
      </ScrollArea>
    </div>
  );
}
