export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-2 border border-rail bg-panel rounded-lg py-16 px-6">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">No records found</p>
      <p className="text-ink/80 max-w-md">No characters match this search and filter combination. Try loosening a filter.</p>
    </div>
  );
}
