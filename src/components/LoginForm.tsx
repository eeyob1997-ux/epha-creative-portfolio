"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";

export default function LoginForm() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(formData: FormData) {
    setBusy(true);
    setError("");

    try {
      const supabase = createClient();

      const email = String(formData.get("email") || "");
      const password = String(formData.get("password") || "");

      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError || !data.user) {
        throw new Error("Invalid email or password.");
      }

      // Check admin identity on the server.
      const response = await fetch("/api/auth/admin-check", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        await supabase.auth.signOut();
        throw new Error("You are not authorized to access the admin area.");
      }

      router.replace("/admin");
      router.refresh();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Login failed. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-5">
      <form
        action={submit}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-panel p-8"
      >
        <Link href="/" className="text-xs uppercase tracking-widest text-lime">
          ← Back to portfolio
        </Link>

        <h1 className="mb-2 mt-8 text-4xl font-black tracking-tight">
          Admin login<span className="text-lime">.</span>
        </h1>

        <p className="mb-8 text-sm text-white/50">
          Sign in to manage your portfolio projects.
        </p>

        <label className="mb-5 block text-xs uppercase tracking-wider">
          Email
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            className="mt-2 w-full rounded-lg border border-white/15 bg-black/30 p-3 normal-case outline-none focus:border-lime"
            placeholder="admin@example.com"
          />
        </label>

        <label className="mb-6 block text-xs uppercase tracking-wider">
          Password
          <input
            required
            type="password"
            name="password"
            autoComplete="current-password"
            className="mt-2 w-full rounded-lg border border-white/15 bg-black/30 p-3 normal-case outline-none focus:border-lime"
            placeholder="Enter your password"
          />
        </label>

        {error && (
          <p role="alert" className="mb-4 text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-lime px-5 py-3 font-semibold text-ink disabled:opacity-50"
        >
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
