import { useState, useRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Check, Edit, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  onEdit?: (newTitle: string) => void;
};

export function ContentTitle({ title, onEdit }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const [isEditorMode, setIsEditorMode] = useState(false);

  function handleSubmit() {
    if (!ref.current) return;
    const value = ref.current.value;
    if (!value) return alert("title is empty!");

    setIsEditorMode(false);
    onEdit?.(value);
  }

  function handleCancel() {
    if (ref.current) {
      ref.current.value = title;
    }
    setIsEditorMode(false);
  }

  return (
    <div className={cn("flex items-center gap-2", isEditorMode ? "" : "group")}>
      {isEditorMode ? (
        <>
          <Input
            ref={ref}
            className="max-w-md"
            autoFocus
            defaultValue={title}
          />
          <Button variant="default" size="sm" onClick={handleSubmit}>
            <Check className="size-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleCancel}>
            <X className="size-4" />
          </Button>
        </>
      ) : (
        <>
          <h1 className="font-bold text-2xl">{title}</h1>
          {onEdit !== undefined && (
            <Button
              variant="ghost"
              size="sm"
              className="hidden group-hover:block"
              onClick={() => setIsEditorMode(true)}
            >
              <Edit className="size-5" />
            </Button>
          )}
        </>
      )}
    </div>
  );
}
