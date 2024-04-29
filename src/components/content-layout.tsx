import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

function ContentLayout(props: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn("h-full w-full flex flex-col gap-4 pb-4", props.className)}>
      {props.children}
    </div>
  );
}

ContentLayout.Header = (
  props: PropsWithChildren<{ actions?: React.ReactNode }>,
) => {
  return (
    <div className="border-b h-16 p-4 flex items-center">
      {props.children}
      {props.actions !== undefined && (
        <div className="ml-auto flex gap-1.5">{props.actions}</div>
      )}
    </div>
  );
};

export { ContentLayout };
