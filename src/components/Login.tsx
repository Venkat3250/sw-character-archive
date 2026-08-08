import React, { useState } from 'react';
import { DEMO_CREDENTIALS, useAuth } from '../context/AuthContext';

export function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = login(username, password);
    if (!result.ok) setError(result.error ?? 'Login failed.');
  }

  function fillDemo() {
    setUsername(DEMO_CREDENTIALS.username);
    setPassword(DEMO_CREDENTIALS.password);
    setError(null);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-riseIn">
        <div className="text-center mb-6">
          <p className="font-mono text-xs tracking-[0.3em] text-amber uppercase">SW // Records Terminal</p>
          <h1 className="font-display text-2xl font-bold mt-2 text-glow-amber">Character Archive</h1>
          <p className="text-muted text-sm mt-1">Authenticate to access the archive</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-panel border border-rail rounded-lg p-6 space-y-4 shadow-glow"
          aria-label="Login form"
        >
          <div>
            <label htmlFor="username" className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
              Username
            </label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="focus-ring w-full bg-void border border-rail rounded px-3 py-2 text-ink placeholder:text-muted/60"
              placeholder="padawan"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="focus-ring w-full bg-void border border-rail rounded px-3 py-2 text-ink placeholder:text-muted/60"
              placeholder="••••••••••"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-rose-400 bg-rose-950/30 border border-rose-900/50 rounded px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="focus-ring w-full bg-amber text-void font-semibold rounded py-2 hover:bg-amber-soft transition-colors"
          >
            Sign in
          </button>

          <button
            type="button"
            onClick={fillDemo}
            className="focus-ring w-full text-xs font-mono text-cyan hover:text-cyan-soft transition-colors"
          >
            Use demo credentials ({DEMO_CREDENTIALS.username} / {DEMO_CREDENTIALS.password})
          </button>
        </form>

        <p className="text-center text-muted text-xs mt-4 font-mono">
          Auth is mocked client-side — SWAPI itself needs no credentials.
        </p>
      </div>
    </div>
  );
}
