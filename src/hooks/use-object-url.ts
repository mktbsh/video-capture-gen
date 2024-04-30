import { objectURL } from "@/lib/object-url";
import { useEffect, useState } from "react";

type ObjectSource = Blob | MediaSource | File;

export function useObjectURL(initialObject: ObjectSource) {
  const [obj] = useState<ObjectSource>(initialObject);
  const [url, setURL] = useState<string>("");

  useEffect(() => {
    if (!obj) return;

    const _url = objectURL.create(obj);
    setURL(_url);

    return () => {
      objectURL.revoke(_url);
      setURL("");
    };
  }, [obj]);

  return {
    url,
  };
}
