import { CaptureGrid } from "@/components/capture-grid";
import { ContentLayout } from "@/components/content-layout";
import { ContentTitle } from "@/components/content-title";
import { Button } from "@/components/ui/button";
import { createDOM } from "@/lib/dom";
import { fileSize } from "@/lib/file";
import { compress } from "@/lib/zip";
import { updateMetaTitle } from "@/repository/meta-repository";
import { deleteByVideoKey } from "@/usecase/delete-video";
import { useCapturesByVideoKey } from "@/usecase/use-captures";
import { useGetMetaByKey } from "@/usecase/use-meta";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/v/$key")({
  component: Page,
});

function Page() {
  const { key } = Route.useParams();
  const meta = useGetMetaByKey(key);
  const navigate = useNavigate({ from: "/v/$key" });

  const { captures, totalSize } = useCapturesByVideoKey(key);

  async function handleEditTitle(newTitle: string) {
    if (!meta) return;
    await updateMetaTitle(meta.key, newTitle);
  }

  async function handleDelete() {
    await navigate({
      to: "/",
      replace: true,
    });
    deleteByVideoKey(key);
  }

  async function handleDownloadZip() {
    const zipName = `${crypto.randomUUID()}.zip`;
    const files = captures.map(v => v.data);

    const zip = await compress(files, zipName)
    const a = createDOM("a", (el) => {
      el.download = zipName;
      el.href = URL.createObjectURL(zip)
    })

    a.click();
    URL.revokeObjectURL(a.href);
    a.remove();
  }

  if (!meta) return null;

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
