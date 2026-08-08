interface Props {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: Props) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center text-center gap-3 border border-rose-900/50 bg-rose-950/20 rounded-lg py-16 px-6"
    >
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-rose-400">Archive unreachable</p>
      <p className="text-ink max-w-md">{message}</p>
      <button
        onClick={onRetry}
        className="focus-ring mt-2 border border-rose-800 text-rose-300 hover:bg-rose-900/30 rounded px-4 py-2 text-sm font-mono uppercase tracking-wider transition-colors"
      >
        Retry
      </button>
    </div>
  );
}
