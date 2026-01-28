"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push("/admin/dashboard");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-veloria-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-veloria-border bg-veloria-elevated/80 p-8">
          <div className="mb-6 text-center">
            <Link href="/" className="inline-block mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-veloria-border bg-gradient-to-br from-veloria-gold/40 via-veloria-elevated to-veloria-black text-lg font-semibold text-veloria-black shadow-[0_0_0_1px_rgba(0,0,0,0.7)]">
                V
              </div>
            </Link>
            <h1 className="text-2xl font-semibold text-veloria-cream mb-2">
              Admin Login
            </h1>
            <p className="text-sm text-veloria-muted">
              Sign in to manage the menu
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="username" className="text-xs text-veloria-muted">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-xs text-veloria-muted">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-full bg-veloria-gold px-6 text-xs font-semibold uppercase tracking-[0.18em] text-veloria-black shadow-[0_18px_40px_rgba(0,0,0,0.75)] transition hover:bg-veloria-gold-soft disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs text-veloria-muted hover:text-veloria-cream"
            >
              ← Back to website
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
