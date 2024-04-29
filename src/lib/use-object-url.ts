import { useEffect, useState } from "react";

type ObjectSource = Blob | MediaSource | File;

export function useObjectURL(initialObject: ObjectSource) {
  const [obj] = useState<ObjectSource>(initialObject);
  const [url, setURL] = useState<string>("");

  useEffect(() => {
    if (!obj) return;

    const objectURL = URL.createObjectURL(obj);
    setURL(objectURL);

    return () => {
      URL.revokeObjectURL(objectURL);
      setURL("");
    };
  }, [obj]);

  return {
    url,
  };
}
