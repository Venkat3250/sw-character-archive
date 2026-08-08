import { useAuth } from '../context/AuthContext';

export function Header() {
  const { displayName, logout, secondsUntilRefresh } = useAuth();

  return (
    <header className="border-b border-rail bg-panel/60 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-amber uppercase">SW // Records Terminal</p>
          <h1 className="font-display text-lg font-bold leading-tight text-glow-amber">Character Archive</h1>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="text-right font-mono text-xs text-muted hidden sm:block">
            <div>
              signed in as <span className="text-cyan">{displayName}</span>
            </div>
            {secondsUntilRefresh !== null && (
              <div title="Access token silently refreshes automatically">
                token refresh in <span className="text-amber">{secondsUntilRefresh}s</span>
              </div>
            )}
          </div>
          <button
            onClick={logout}
            className="focus-ring border border-rail rounded px-3 py-1.5 font-mono text-xs uppercase tracking-wider hover:border-amber hover:text-amber transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
