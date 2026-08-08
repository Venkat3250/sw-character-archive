export function LoadingState({ count = 10 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
      role="status"
      aria-live="polite"
      aria-label="Loading characters"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-panel border border-rail rounded-lg overflow-hidden animate-pulse">
          <div className="aspect-[4/5] bg-rail/60" />
          <div className="p-3 pl-4 space-y-2">
            <div className="h-3 bg-rail/60 rounded w-3/4" />
            <div className="h-2.5 bg-rail/40 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
