export default function SkeletonCard() {
  return (
    <div className="card animate-pulse p-6">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 h-5 w-2/3 rounded-lg bg-ink-100" />
          <div className="h-3 w-1/3 rounded bg-ink-50" />
        </div>
        <div className="h-6 w-16 rounded-full bg-ink-100" />
      </div>
      <div className="mb-2 h-3 w-full rounded bg-ink-50" />
      <div className="mb-4 h-3 w-5/6 rounded bg-ink-50" />
      <div className="mb-3 h-16 rounded-2xl bg-leaf-50" />
      <div className="h-8 w-32 rounded-full bg-ink-100" />
    </div>
  );
}