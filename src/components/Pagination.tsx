interface Props {
  page: number;
  totalPages: number;
  totalRecords: number;
  onChange: (page: number) => void;
  disabled?: boolean;
}

function getPageWindow(current: number, total: number, size = 5): number[] {
  const half = Math.floor(size / 2);
  let start = Math.max(1, current - half);
  const end = Math.min(total, start + size - 1);
  start = Math.max(1, end - size + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function Pagination({ page, totalPages, totalRecords, onChange, disabled }: Props) {
  if (totalPages <= 1) return null;
  const pages = getPageWindow(page, totalPages);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-8 flex-wrap">
      <button
        onClick={() => onChange(page - 1)}
        disabled={disabled || page <= 1}
        className="focus-ring border border-rail rounded px-3 py-1.5 font-mono text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:border-amber hover:text-amber transition-colors"
      >
        Prev
      </button>

      {pages[0] > 1 && <span className="text-muted font-mono text-xs px-1">…</span>}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          disabled={disabled}
          aria-current={p === page ? 'page' : undefined}
          className={`focus-ring rounded px-3 py-1.5 font-mono text-xs border transition-colors ${
            p === page
              ? 'bg-amber text-void border-amber font-semibold'
              : 'border-rail hover:border-amber hover:text-amber'
          }`}
        >
          {p}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && <span className="text-muted font-mono text-xs px-1">…</span>}

      <button
        onClick={() => onChange(page + 1)}
        disabled={disabled || page >= totalPages}
        className="focus-ring border border-rail rounded px-3 py-1.5 font-mono text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:border-amber hover:text-amber transition-colors"
      >
        Next
      </button>

      <span className="w-full text-center text-[11px] font-mono text-muted mt-1">
        Page {page} of {totalPages} · {totalRecords} record{totalRecords === 1 ? '' : 's'}
      </span>
    </nav>
  );
}
