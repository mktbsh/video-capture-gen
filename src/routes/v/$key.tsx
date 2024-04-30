import { CaptureGrid } from "@/components/capture-grid";
import { ContentLayout } from "@/components/content-layout";
import { ContentTitle } from "@/components/content-title";
import { Button } from "@/components/ui/button";
import { fileSize } from "@/lib/file";
import { useCapturesByVideoKey } from "@/usecase/use-captures";
import { useGetMetaByKey } from "@/usecase/use-meta";
import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { usePageLogic } from "./-lib/use-$key-logic";

export const Route = createFileRoute("/v/$key")({
  component: Page,
});

function Page() {
  const { key } = Route.useParams();
  const meta = useGetMetaByKey(key);

  const { captures, totalSize } = useCapturesByVideoKey(key);

  const logic = usePageLogic();

  if (!meta) return null;

  const handleEditTitle = logic.registerEditTitleFn(meta.key);
  const handleDelete = logic.registerDeleteVideoFn(meta.key);
  const handleDownloadZip = logic.registerDownloadZipFn(captures);

  return (
    <ContentLayout className="pb-0">
      <ContentLayout.Header
        actions={
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="size-4" />
          </Button>
        }
      >
        <ContentTitle title={meta.title} onEdit={handleEditTitle} />
      </ContentLayout.Header>
      <div className="min-h-0 flex-1 rounded-xl">
        <CaptureGrid captures={captures} />
      </div>
      <div className="h-14 flex border-t items-center px-5 gap-5">
        <Button size="sm" onClick={handleDownloadZip}>
          Download as zip
        </Button>
        <span className="ml-auto">
          {fileSize({
            source: totalSize,
            digit: 2,
          })}
        </span>
      </div>
    </ContentLayout>
  );
}
