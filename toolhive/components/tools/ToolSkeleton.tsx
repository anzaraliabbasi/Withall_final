export default function ToolSkeleton() {
  return (
    <div className="card space-y-4 p-6" aria-label="Loading tool…">
      <div className="h-7 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      <div className="space-y-3">
        <div className="h-10 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-10 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-10 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="h-10 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}
