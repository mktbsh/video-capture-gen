import { cn, toMmSs } from "@/lib/utils";

type Props = {
  progress?: number;
  timeStats: {
    label: string;
    value: number;
  }[];
};

export function Stats({ progress, timeStats }: Props) {
  const hasProgress = progress !== undefined;

  return (
    <dl
      className={cn(
        "pt-3 grid gap-5",
        hasProgress ? "grid-cols-4" : "grid-cols-3",
      )}
    >
      {timeStats.map((stat) => (
        <div
          key={stat.label}
          className="overflow-hidden rounded-lg bg-white p-4 shadow"
        >
          <dt className="truncate text-sm font-medium text-gray-500">
            {stat.label}
          </dt>
          <dd className="mt-1 text-xl font-semibold tracking-tight text-gray-900">
            {toMmSs(stat.value)}
          </dd>
        </div>
      ))}
      {hasProgress && (
        <div className="overflow-hidden rounded-lg bg-white p-4 shadow">
          <dt className="truncate text-sm font-medium text-gray-500">
            Progress
          </dt>
          <dd className="mt-1 text-xl font-semibold tracking-tight text-gray-900">
            {progress.toFixed(0)}%
          </dd>
        </div>
      )}
    </dl>
  );
}
