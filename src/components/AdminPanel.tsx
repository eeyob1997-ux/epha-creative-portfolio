"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  LogOut,
  ExternalLink,
  Inbox,
  MessageSquareQuote,
  Check,
  X,
} from "lucide-react";

type Project = {
  id: string;
  title: string;
  category: string;
  image_url: string;
  published: boolean;
};

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

type Testimonial = {
  id: string;
  client_name: string;
  project_name: string;
  feedback: string;
  rating: number;
  created_at: string;
};

const emptyForm = {
  title: "",
  category: "Poster Design",
  image_url: "",
  published: false,
};

async function getApiError(response: Response, fallback: string) {
  let data: unknown;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof data.error === "string"
  ) {
    return data.error;
  }

  return `${fallback} (HTTP ${response.status}).`;
}

export default function AdminPanel() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [projectError, setProjectError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [testimonialError, setTestimonialError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const [projectResponse, messageResponse, testimonialResponse] =
        await Promise.all([
          fetch("/api/admin/projects", { cache: "no-store" }),
          fetch("/api/admin/messages", { cache: "no-store" }),
          fetch("/api/admin/testimonials", { cache: "no-store" }),
        ]);

      if (projectResponse.ok) {
        setProjects(await projectResponse.json());
        setProjectError("");
      } else {
        setProjectError(
          await getApiError(projectResponse, "Could not load projects"),
        );
      }

      if (messageResponse.ok) {
        setMessages(await messageResponse.json());
        setMessageError("");
      } else {
        setMessageError(
          await getApiError(messageResponse, "Could not load contact messages"),
        );
      }

      if (testimonialResponse.ok) {
        setTestimonials(await testimonialResponse.json());
        setTestimonialError("");
      } else if (testimonialResponse.status === 401) {
        setTestimonialError("Please sign in again to manage testimonials.");
      } else {
        setTestimonialError(
          await getApiError(testimonialResponse, "Could not load testimonials"),
        );
      }
    } catch {
      const error = "Could not connect to the server. Please refresh the page.";
      setProjectError(error);
      setMessageError(error);
      setTestimonialError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function startEditing(project: Project) {
    setEditingId(project.id);
    setImageFile(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
    setForm({
      title: project.title,
      category: project.category,
      image_url: project.image_url,
      published: project.published,
    });
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEditing() {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
    setNotice("");
  }

  async function saveProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setNotice("");

    try {
      let imageUrl = form.image_url.trim();

      if (imageFile) {
        const uploadForm = new FormData();
        uploadForm.set("file", imageFile);

        const uploadResponse = await fetch("/api/admin/project-image", {
          method: "POST",
          body: uploadForm,
        });
        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadResult.error || "Could not upload image.");
        }

        imageUrl = uploadResult.image_url;
      }

      const response = await fetch(
        editingId ? `/api/projects/${editingId}` : "/api/projects",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, image_url: imageUrl }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not save project.");
      }

      const wasEditing = Boolean(editingId);

      setForm(emptyForm);
      setImageFile(null);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
      setEditingId(null);
      setNotice(
        wasEditing
          ? "Project updated successfully."
          : "Project added successfully.",
      );

      await load();
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function togglePublished(project: Project) {
    setNotice("");
    setBusy(true);

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !project.published }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not update publishing status.");
      }

      setNotice(
        project.published ? "Project unpublished." : "Project published.",
      );

      await load();
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function deleteProject(id: string) {
    if (busy || !confirm("Delete this project? This cannot be undone.")) {
      return;
    }

    setNotice("");
    setBusy(true);

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not delete project.");
      }

      if (editingId === id) {
        cancelEditing();
      }

      setProjects((old) => old.filter((project) => project.id !== id));
      setNotice("Project deleted successfully.");
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function updateTestimonial(
    testimonial: Testimonial,
    action: "approve" | "reject",
  ) {
    if (
      busy ||
      (action === "reject" &&
        !confirm("Reject and permanently delete this testimonial?"))
    ) {
      return;
    }

    setNotice("");
    setBusy(true);

    try {
      const response = await fetch("/api/admin/testimonials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: testimonial.id,
          action,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not update testimonial.");
      }

      setTestimonials((old) =>
        old.filter((item) => item.id !== testimonial.id),
      );

      setNotice(
        action === "approve"
          ? "Testimonial approved successfully."
          : "Testimonial rejected and deleted.",
      );
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        setNotice("Could not sign out. Please try again.");
        return;
      }

      window.location.href = "/admin/login";
    } catch {
      setNotice("Could not connect to the server.");
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-8 md:px-10">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <Link
            href="/"
            className="text-xs uppercase tracking-widest text-lime"
          >
            ← View website
          </Link>

          <h1 className="mt-3 text-4xl font-black tracking-tight">
            Studio admin<span className="text-lime">.</span>
          </h1>
        </div>

        <button
          type="button"
          onClick={() => void logout()}
          className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm hover:border-lime"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </header>

      {notice && (
        <p role="status" className="mb-6 text-sm text-lime">
          {notice}
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-2xl border border-white/10 bg-panel p-6">
          <div className="mb-6 flex items-center gap-3">
            {editingId ? (
              <Pencil className="text-lime" />
            ) : (
              <Plus className="text-lime" />
            )}

            <h2 className="text-2xl font-bold">
              {editingId ? "Edit project" : "Add a project"}
            </h2>
          </div>

          <form onSubmit={saveProject} className="space-y-4">
            <label className="block text-xs uppercase tracking-wider text-white/60">
              Project title
              <input
                required
                disabled={busy}
                maxLength={120}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Worship Poster"
                className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 p-3 text-sm normal-case text-white outline-none focus:border-lime"
              />
            </label>

            <label className="block text-xs uppercase tracking-wider text-white/60">
              Category
              <input
                required
                disabled={busy}
                maxLength={80}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Poster Design"
                className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 p-3 text-sm normal-case text-white outline-none focus:border-lime"
              />
            </label>

            <label className="block text-xs uppercase tracking-wider text-white/60">
              Image path or URL
              <input
                required={!imageFile}
                disabled={busy}
                maxLength={2000}
                value={form.image_url}
                onChange={(e) =>
                  setForm({ ...form, image_url: e.target.value })
                }
                placeholder="https://... or upload an image below"
                className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 p-3 text-sm normal-case text-white outline-none focus:border-lime"
              />
              <span className="mt-2 block normal-case text-white/40">
                Use an image URL or choose a file to upload.
              </span>
            </label>

            <label className="block text-xs uppercase tracking-wider text-white/60">
              Upload image
              <input
                ref={imageInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                disabled={busy}
                onChange={(event) =>
                  setImageFile(event.target.files?.[0] ?? null)
                }
                className="mt-2 block w-full text-sm normal-case text-white file:mr-3 file:rounded-full file:border-0 file:bg-lime file:px-4 file:py-2 file:font-semibold file:text-ink"
              />
              <span className="mt-2 block normal-case text-white/40">
                PNG, JPG, WEBP, or GIF; maximum file size 5 MB.
                {imageFile ? ` Selected: ${imageFile.name}` : ""}
              </span>
            </label>

            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) =>
                  setForm({ ...form, published: e.target.checked })
                }
                disabled={busy}
                className="accent-lime"
              />
              Publish immediately
            </label>

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-lime px-5 py-3 font-semibold text-ink disabled:opacity-50"
            >
              {busy
                ? "Saving..."
                : editingId
                  ? "Update project"
                  : "Save project"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEditing}
                disabled={busy}
                className="w-full rounded-full border border-white/20 px-5 py-3 text-sm hover:border-lime disabled:opacity-50"
              >
                Cancel editing
              </button>
            )}
          </form>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">
            Projects <span className="text-lime">({projects.length})</span>
          </h2>

          {projectError && (
            <p
              role="alert"
              className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-300"
            >
              {projectError}
            </p>
          )}

          {loading ? (
            <p className="text-sm text-white/50">Loading projects...</p>
          ) : (
            <div className="space-y-3">
              {projects.length === 0 && !projectError && (
                <p className="rounded-xl border border-dashed border-white/20 p-6 text-sm text-white/50">
                  No projects found.
                </p>
              )}

              {projects.map((project) => (
                <article
                  key={project.id}
                  className="flex items-center gap-4 rounded-xl border border-white/10 bg-panel p-4"
                >
                  <div
                    className="h-16 w-20 shrink-0 rounded-lg bg-cover bg-center"
                    style={{
                      backgroundImage: `url("${project.image_url}")`,
                    }}
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold">{project.title}</h3>

                    <p className="mt-1 text-xs text-white/45">
                      {project.category}
                    </p>

                    <a
                      className="mt-1 inline-flex items-center gap-1 text-xs text-lime"
                      href={project.image_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View image <ExternalLink size={12} />
                    </a>

                    <p className="mt-1 text-xs text-white/50">
                      {project.published ? "Published" : "Draft"}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void togglePublished(project)}
                        className="text-xs text-lime underline disabled:opacity-50"
                      >
                        {project.published ? "Unpublish" : "Publish"}
                      </button>

                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => startEditing(project)}
                        className="inline-flex items-center gap-1 text-xs text-lime underline disabled:opacity-50"
                      >
                        <Pencil size={12} />
                        Edit
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void deleteProject(project.id)}
                    aria-label={`Delete ${project.title}`}
                    className="rounded-full p-2 text-white/50 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                  >
                    <Trash2 size={17} />
                  </button>
                </article>
              ))}
            </div>
          )}

          <h2 className="mb-4 mt-10 flex items-center gap-2 text-2xl font-bold">
            <Inbox className="text-lime" />
            Contact messages{" "}
            <span className="text-lime">({messages.length})</span>
          </h2>

          {messageError && (
            <p
              role="alert"
              className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-300"
            >
              {messageError}
            </p>
          )}

          <div className="space-y-3">
            {messages.length === 0 && !messageError && (
              <p className="rounded-xl border border-dashed border-white/20 p-6 text-sm text-white/50">
                No messages received yet.
              </p>
            )}

            {messages.map((message) => (
              <article
                key={message.id}
                className="rounded-xl border border-white/10 bg-panel p-4"
              >
                <div className="flex flex-wrap justify-between gap-2">
                  <h3 className="font-semibold">{message.name}</h3>
                  <time className="text-xs text-white/40">
                    {new Date(message.created_at).toLocaleDateString()}
                  </time>
                </div>

                <a
                  href={`mailto:${message.email}`}
                  className="text-sm text-lime"
                >
                  {message.email}
                </a>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-white/70">
                  {message.message}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-12">
        <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold">
          <MessageSquareQuote className="text-lime" />
          Testimonials awaiting approval{" "}
          <span className="text-lime">({testimonials.length})</span>
        </h2>

        {testimonialError && (
          <p
            role="alert"
            className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-300"
          >
            {testimonialError}
          </p>
        )}

        {testimonials.length === 0 && !testimonialError ? (
          <p className="rounded-xl border border-dashed border-white/20 p-6 text-sm text-white/50">
            No pending testimonials.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.id}
                className="min-w-0 max-w-full rounded-2xl border border-white/10 bg-panel p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{testimonial.client_name}</h3>

                    <p className="text-sm text-white/50">
                      {testimonial.project_name}
                    </p>

                    <p
                      className="mt-1 text-sm text-amber-300"
                      aria-label={`${testimonial.rating} out of 5 stars`}
                    >
                      {"★".repeat(testimonial.rating)}
                      {"☆".repeat(5 - testimonial.rating)}
                    </p>
                  </div>

                  <time className="text-xs text-white/40">
                    {new Date(testimonial.created_at).toLocaleDateString()}
                  </time>
                </div>

                <p className="mt-4 min-w-0 max-w-full whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm leading-relaxed text-white/70">
                  {testimonial.feedback}
                </p>

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      void updateTestimonial(testimonial, "approve")
                    }
                    className="flex items-center gap-2 rounded-full bg-lime px-4 py-2 text-sm font-semibold text-ink"
                  >
                    <Check size={16} />
                    Approve
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      void updateTestimonial(testimonial, "reject")
                    }
                    className="flex items-center gap-2 rounded-full border border-red-400/40 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10"
                  >
                    <X size={16} />
                    Reject
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
