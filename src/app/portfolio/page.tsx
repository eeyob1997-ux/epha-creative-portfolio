"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

type Project = {
  id: string;
  title: string;
  category: string;
  image_url: string;
  published: boolean;
  client?: string | null;
};

const filters = ["All", "YouTube Design", "Social Media Design", "Poster Design", "Branding", "Digital Design"];
const filterLabels: Record<string, string> = {
  "Social Media Design": "Social Media",
  "Poster Design": "Posters",
  "Digital Design": "Digital",
};

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const r = await fetch("/api/projects", { cache: "no-store" });
        if (!r.ok) return;
        const d: unknown = await r.json();
        if (!cancelled && Array.isArray(d))
          setProjects(
            (d as Project[]).filter(
              (p) =>
                typeof p.id === "string" &&
                typeof p.title === "string" &&
                typeof p.category === "string" &&
                typeof p.image_url === "string"
            )
          );
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  /* custom cursor */
  useEffect(() => {
    const dot = document.getElementById("custom-cursor");
    const ring = document.getElementById("custom-cursor-ring");
    if (!dot || !ring) return;
    let rx = 0, ry = 0;
    function move(e: MouseEvent) {
      dot!.style.left = e.clientX + "px";
      dot!.style.top = e.clientY + "px";
      rx += (e.clientX - rx) * 0.12;
      ry += (e.clientY - ry) * 0.12;
      ring!.style.left = rx + "px";
      ring!.style.top = ry + "px";
    }
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  const visible = activeFilter === "All" ? projects : projects.filter((p) => p.category === activeFilter);

  return (
    <>
      <div id="custom-cursor" aria-hidden="true" />
      <div id="custom-cursor-ring" aria-hidden="true" />
    <main className="min-h-screen bg-[#050606] px-4 pb-24 pt-8 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 flex items-center justify-between">
          <Link
            href="/#portfolio"
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-medium text-white/70 transition hover:border-[#ffa94d]/50 hover:text-white"
          >
            <ArrowLeft size={14} /> Back to home
          </Link>
          <Link
            href="/#contact"
            className="rounded-full border border-white/[0.1] px-4 py-2 text-xs font-semibold text-white/70 transition hover:border-[#ffa94d]/50 hover:text-[#ffa94d]"
          >
            Let&apos;s Talk
          </Link>
        </div>

        <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center text-center">
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-5xl">
            All <span className="font-serif font-normal italic text-white/45">projects</span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-neutral-500">
            Everything I&apos;ve designed, sorted by type.
          </p>
        </div>

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {filters.map((f) => {
            const active = activeFilter === f;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={active}
                onClick={() => setActiveFilter(f)}
                className={`rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                  active
                    ? "border-transparent bg-gradient-to-r from-[#ffc46b] to-[#ff6a3d] text-black shadow-[0_2px_20px_rgba(255,169,77,0.4)]"
                    : "border-white/[0.07] bg-white/[0.03] text-neutral-400 hover:border-[#ffa94d]/35 hover:text-white"
                }`}
              >
                {filterLabels[f] ?? f}
              </button>
            );
          })}
        </div>

        {!loaded ? (
          <div className="flex items-center justify-center gap-3 py-16 text-sm text-neutral-600">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-[#ffa94d]" />
            Loading…
          </div>
        ) : visible.length === 0 ? (
          <p className="py-12 text-center text-sm text-neutral-600">No projects in this category yet.</p>
        ) : (
          <div className="columns-2 gap-3 sm:gap-4 lg:columns-3">
            <AnimatePresence mode="popLayout">
              {visible.map((p, i) => (
                <motion.article
                  layout
                  key={p.id}
                  initial={{ opacity: 0, y: 28, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.88 }}
                  transition={{ duration: 0.4, delay: Math.min(i, 12) * 0.03 }}
                  className="card-hover group mb-3 break-inside-avoid overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] sm:mb-4"
                >
                  <div className="relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image_url}
                      alt={p.title}
                      loading="lazy"
                      className="block h-auto w-full transition-transform duration-700 group-hover:scale-[1.07]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <div className="flex items-center justify-between gap-2 p-3.5 sm:p-4">
                    <div className="min-w-0">
                      <h3 className="truncate text-xs font-semibold sm:text-sm">{p.title}</h3>
                      <p className="mt-0.5 truncate text-[10px] text-neutral-600 sm:text-xs">
                        {p.category} · {p.client ?? "Personal"}
                      </p>
                    </div>
                    <span
                      aria-hidden
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.08] text-[#ffa94d]/60 transition-all group-hover:border-[#ffa94d] group-hover:bg-gradient-to-br group-hover:from-[#ffc46b] group-hover:to-[#ff6a3d] group-hover:text-black"
                    >
                      <ArrowUpRight size={14} />
                    </span>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
    </>
  );
}