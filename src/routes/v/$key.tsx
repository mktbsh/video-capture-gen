import { CaptureGrid } from "@/components/capture-grid";
import { ContentLayout } from "@/components/content-layout";
import { ContentTitle } from "@/components/content-title";
import { Button } from "@/components/ui/button";
import { updateMetaTitle } from "@/repository/meta-repository";
import { deleteByVideoKey } from "@/usecase/delete-video";
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

  async function handleEditTitle(newTitle: string) {
    if (!meta) return;
    await updateMetaTitle(meta.key, newTitle);
  }

  async function handleDelete() {
    await navigate({
      to: "/",
      replace: true,
    })
    deleteByVideoKey(key);
  }

  if (!meta) return null;

  return (
    <ContentLayout>
      <ContentLayout.Header actions={
        <Button variant="destructive" onClick={handleDelete}>
          <Trash2 className="size-4" />
        </Button>
      }>
        <ContentTitle title={meta.title} onEdit={handleEditTitle} />

      </ContentLayout.Header>
      <div className="min-h-0 rounded-xl">
        <CaptureGrid videoKey={meta.key} />
      </div>
    </ContentLayout>
  );
}
