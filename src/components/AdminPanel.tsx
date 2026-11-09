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
  LayoutDashboard,
  FolderKanban,
  Eye,
  EyeOff,
  Menu,
  X as CloseIcon,
  Image as ImageIcon,
  ArrowUpRight,
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Dashboard");

  async function refreshProjects() {
    try {
      const response = await fetch("/api/admin/projects", { cache: "no-store" });

      if (response.ok) {
        setProjects(await response.json());
        setProjectError("");
      } else {
        setProjectError(
          await getApiError(response, "Could not load projects"),
        );
      }
    } catch {
      setProjectError("Could not connect to the server. Please refresh the page.");
    }
  }

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

      await refreshProjects();
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

      await refreshProjects();
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

  const publishedProjects = projects.filter(
    (project) => project.published,
  ).length;

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", target: "dashboard" },
    { icon: FolderKanban, label: "Projects", target: "projects" },
    { icon: Inbox, label: "Messages", target: "messages" },
    {
      icon: MessageSquareQuote,
      label: "Testimonials",
      target: "testimonials",
    },
  ];

  function navigateToSection(label: string, target: string) {
    setActiveSection(label);
    setSidebarOpen(false);

    const section = document.getElementById(target);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  return (
    <main className="min-h-screen bg-[#171717] text-[#F5F5F5]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/70 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/[0.08] bg-[#111111] p-6 text-[#F5F5F5] transition-transform duration-200 ease-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tight">
            Studio<span className="text-[#FF5A1F]">.</span>
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-white/60 transition-all duration-150 ease-out hover:bg-white/10 lg:hidden"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <div className="mt-10">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
            Management
          </p>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => navigateToSection(item.label, item.target)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150 ease-out ${
                    activeSection === item.label
                      ? "border border-white/[0.08] bg-gradient-to-r from-[#292929] to-[#1d1d1d] text-white shadow-sm"
                      : "border border-transparent text-[#9CA3AF] hover:bg-white/[0.05] hover:text-[#F5F5F5]"
                  }`}
                >
                  <Icon
                    size={18}
                    className={
                      activeSection === item.label ? "text-[#FF5A1F]" : ""
                    }
                  />
                  {item.label}

                  {item.label === "Messages" && messages.length > 0 && (
                    <span className="ml-auto rounded-full border border-white/[0.08] bg-white/[0.06] px-2 py-0.5 text-xs text-[#D1D5DB]">
                      {messages.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-white/[0.08] pt-5">
          <Link
            href="/"
            className="mb-3 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#9CA3AF] transition-all duration-150 ease-out hover:bg-white/[0.05] hover:text-white"
          >
            <ExternalLink size={17} />
            View website
          </Link>

          <button
            type="button"
            onClick={() => void logout()}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#9CA3AF] transition-all duration-150 ease-out hover:bg-red-500/10 hover:text-[#EF4444]"
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="lg:ml-72">
        {/* TOP HEADER */}
        <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#151515]/95 px-5 py-4 backdrop-blur md:px-8 lg:px-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-xl border border-white/[0.08] bg-[#222222] p-2.5 text-[#F5F5F5] transition-all duration-150 ease-out hover:bg-[#2A2A2A] lg:hidden"
              >
                <Menu size={20} />
              </button>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6B7280]">
                  Admin Panel
                </p>
                <h1 className="mt-1 text-xl font-bold tracking-tight text-[#F5F5F5]">
                  {activeSection}<span className="text-[#FF5A1F]">.</span>
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-[#F5F5F5]">Studio Admin</p>
                <p className="text-xs text-[#6B7280]">Portfolio management</p>
              </div>

              <div className="grid h-10 w-10 place-items-center rounded-full border border-white/[0.08] bg-[#2A2A2A] text-sm font-bold text-[#FF6B35]">
                SA
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl p-5 md:p-7 lg:p-9">
          {/* SUCCESS / ERROR NOTICE */}
          {notice && (
            <div className="mb-8 flex items-center gap-3 rounded-2xl border border-[#A3E635]/20 bg-[#A3E635]/10 px-5 py-4 text-sm font-medium text-[#D9F99D]">
              <Check size={18} />
              {notice}
            </div>
          )}

          {/* WELCOME */}
          <section
            id="dashboard"
            className="scroll-mt-28 mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"
          >
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-[#F5F5F5] md:text-4xl">
                Welcome back, Admin.
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#9CA3AF]">
                Manage your portfolio projects, review client messages, and
                approve testimonials from one place.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                cancelEditing();
                document.getElementById("project-form")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF5A1F] px-5 py-3 text-sm font-semibold text-white transition-all duration-150 ease-out hover:bg-[#FF6B35]"
            >
              <Plus size={18} />
              Add new project
            </button>
          </section>

          {/* STATISTICS */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#252525] to-[#202020] p-5 shadow-lg shadow-black/10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[#9CA3AF]">
                    Total Projects
                  </p>
                  <p className="mt-3 text-4xl font-bold text-[#F5F5F5]">{projects.length}</p>
                </div>

                <div className="rounded-xl border border-[#FF5A1F]/15 bg-[#FF5A1F]/10 p-3 text-[#FF6B35]">
                  <FolderKanban size={21} />
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#252525] to-[#202020] p-5 shadow-lg shadow-black/10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[#9CA3AF]">Published</p>
                  <p className="mt-3 text-4xl font-bold text-[#F5F5F5]">
                    {publishedProjects}
                  </p>
                </div>

                <div className="rounded-xl border border-[#A3E635]/15 bg-[#A3E635]/10 p-3 text-[#A3E635]">
                  <Eye size={21} />
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#252525] to-[#202020] p-5 shadow-lg shadow-black/10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[#9CA3AF]">Messages</p>
                  <p className="mt-3 text-4xl font-bold text-[#F5F5F5]">{messages.length}</p>
                </div>

                <div className="rounded-xl border border-white/[0.08] bg-[#2A2A2A] p-3 text-[#9CA3AF]">
                  <Inbox size={21} />
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#252525] to-[#202020] p-5 shadow-lg shadow-black/10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[#9CA3AF]">
                    Pending Reviews
                  </p>
                  <p className="mt-3 text-4xl font-bold text-[#F5F5F5]">
                    {testimonials.length}
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.08] bg-[#2A2A2A] p-3 text-[#9CA3AF]">
                  <MessageSquareQuote size={21} />
                </div>
              </div>
            </article>
          </section>

          {/* PROJECT MANAGEMENT */}
          <section
            id="projects"
            className="scroll-mt-28 mt-10 grid gap-8 xl:grid-cols-[400px_minmax(0,1fr)]"
          >
            {/* FORM */}
            <section
              id="project-form"
              className="scroll-mt-28 h-fit rounded-2xl border border-white/[0.08] bg-[#222222] p-6 shadow-xl shadow-black/10"
            >
              <div className="mb-7 flex items-center justify-between">
                <div>
                  <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl border border-[#FF5A1F]/20 bg-[#FF5A1F]/10">
                    {editingId ? (
                      <Pencil size={20} className="text-[#FF6B35]" />
                    ) : (
                      <Plus size={21} className="text-[#FF6B35]" />
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-[#F5F5F5]">
                    {editingId ? "Edit project" : "New project"}
                  </h2>

                  <p className="mt-1 text-sm text-[#9CA3AF]">
                    Add your work to the portfolio.
                  </p>
                </div>
              </div>

              <form onSubmit={saveProject} className="space-y-5">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                    Project title
                  </span>

                  <input
                    required
                    disabled={busy}
                    maxLength={120}
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="e.g. Worship Poster"
                    className="mt-2 w-full rounded-xl border border-white/[0.08] bg-[#1C1C1C] px-4 py-3 text-sm text-[#F5F5F5] outline-none placeholder:text-[#6B7280] transition-all duration-150 ease-out focus:border-[#FF5A1F] focus:ring-2 focus:ring-[#FF5A1F]/20"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                    Category
                  </span>

                  <input
                    required
                    disabled={busy}
                    maxLength={80}
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    placeholder="Poster Design"
                    className="mt-2 w-full rounded-xl border border-white/[0.08] bg-[#1C1C1C] px-4 py-3 text-sm text-[#F5F5F5] outline-none placeholder:text-[#6B7280] transition-all duration-150 ease-out focus:border-[#FF5A1F] focus:ring-2 focus:ring-[#FF5A1F]/20"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                    Image URL
                  </span>

                  <input
                    required={!imageFile}
                    disabled={busy}
                    maxLength={2000}
                    value={form.image_url}
                    onChange={(e) =>
                      setForm({ ...form, image_url: e.target.value })
                    }
                    placeholder="https://..."
                    className="mt-2 w-full rounded-xl border border-white/[0.08] bg-[#1C1C1C] px-4 py-3 text-sm text-[#F5F5F5] outline-none placeholder:text-[#6B7280] transition-all duration-150 ease-out focus:border-[#FF5A1F] focus:ring-2 focus:ring-[#FF5A1F]/20"
                  />
                </label>

                <label className="block">
                  <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                    <ImageIcon size={14} />
                    Upload image
                  </span>

                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    disabled={busy}
                    onChange={(event) =>
                      setImageFile(event.target.files?.[0] ?? null)
                    }
                    className="mt-2 block w-full rounded-xl border border-dashed border-white/[0.12] bg-[#1C1C1C] p-3 text-xs text-[#D1D5DB] file:mr-3 file:rounded-lg file:border-0 file:bg-[#FF5A1F] file:px-3 file:py-2 file:font-bold file:text-white"
                  />

                  <p className="mt-2 text-xs text-[#6B7280]">
                    PNG, JPG, WEBP or GIF. Maximum 5 MB.
                    {imageFile ? ` Selected: ${imageFile.name}` : ""}
                  </p>
                </label>

                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/[0.08] bg-[#1C1C1C] p-4">
                  <div>
                    <p className="text-sm font-bold">Publish immediately</p>
                    <p className="mt-1 text-xs text-[#6B7280]">
                      Make this project visible on your website.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        published: e.target.checked,
                      })
                    }
                    disabled={busy}
                    className="h-5 w-5 accent-[#FF5A1F]"
                  />
                </label>

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-xl bg-[#FF5A1F] px-5 py-3.5 text-sm font-bold text-white transition-all duration-150 ease-out hover:bg-[#FF6B35] disabled:opacity-50"
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
                    className="w-full rounded-xl border border-white/[0.08] bg-[#2A2A2A] px-5 py-3 text-sm font-semibold text-[#D1D5DB] transition-all duration-150 ease-out hover:bg-[#333333]"
                  >
                    Cancel editing
                  </button>
                )}
              </form>
            </section>

            {/* PROJECT LIST */}
            <section>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#6B7280]">
                    Portfolio
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-[#F5F5F5]">
                    Your Projects
                    <span className="ml-2 text-[#FF6B35]">({projects.length})</span>
                  </h2>
                </div>
              </div>

              {projectError && (
                <p className="mb-4 rounded-xl border border-[#EF4444]/20 bg-[#EF4444]/10 p-4 text-sm text-[#FCA5A5]">
                  {projectError}
                </p>
              )}

              {loading ? (
                <div className="rounded-2xl border border-white/[0.08] bg-[#222222] p-8 text-sm text-[#9CA3AF]">
                  Loading projects...
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {projects.length === 0 && !projectError && (
                    <div className="rounded-2xl border border-dashed border-white/[0.12] bg-[#222222] p-10 text-center text-sm text-[#9CA3AF] md:col-span-2">
                      No projects found. Add your first project.
                    </div>
                  )}

                  {projects.map((project) => (
                    <article
                      key={project.id}
                      className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#222222] shadow-lg shadow-black/10 transition-all duration-150 ease-out hover:-translate-y-1 hover:border-white/[0.14] hover:shadow-xl"
                    >
                      <div className="relative h-48 overflow-hidden bg-[#1C1C1C]">
                        <div
                          className="h-full w-full bg-cover bg-center transition-transform duration-200 ease-out group-hover:scale-105"
                          style={{
                            backgroundImage: `url("${project.image_url}")`,
                          }}
                        />

                        <div className="absolute right-3 top-3">
                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                              project.published
                                ? "bg-[#A3E635] text-[#0b0c0a]"
                                : "bg-[#3A3A3A] text-[#D1D5DB]"
                            }`}
                          >
                            {project.published ? "Published" : "Draft"}
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                          {project.category}
                        </p>

                        <h3 className="mt-2 truncate text-lg font-bold text-[#F5F5F5]">
                          {project.title}
                        </h3>

                        <div className="mt-5 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => void togglePublished(project)}
                              className="rounded-lg border border-white/[0.08] bg-[#2A2A2A] p-2.5 text-[#D1D5DB] transition-all duration-150 ease-out hover:border-[#FF5A1F]/30 hover:bg-[#FF5A1F]/10 hover:text-[#FF6B35] disabled:opacity-50"
                              aria-label={
                                project.published
                                  ? "Unpublish project"
                                  : "Publish project"
                              }
                            >
                              {project.published ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </button>

                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => startEditing(project)}
                              className="rounded-lg border border-white/[0.08] bg-[#2A2A2A] p-2.5 text-[#D1D5DB] transition-all duration-150 ease-out hover:border-[#FF5A1F]/30 hover:bg-[#FF5A1F]/10 hover:text-[#FF6B35] disabled:opacity-50"
                              aria-label="Edit project"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => void deleteProject(project.id)}
                              className="rounded-lg border border-[#EF4444]/15 bg-[#EF4444]/10 p-2.5 text-[#F87171] transition-all duration-150 ease-out hover:bg-[#EF4444] hover:text-white disabled:opacity-50"
                              aria-label={`Delete ${project.title}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          <a
                            href={project.image_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-xs font-bold text-[#9CA3AF] transition-all duration-150 ease-out hover:text-[#FF6B35]"
                          >
                            View
                            <ArrowUpRight size={15} />
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </section>

          {/* MESSAGES */}
          <section id="messages" className="scroll-mt-28 mt-12">
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#6B7280]">
                Inbox
              </p>

              <h2 className="mt-1 flex items-center gap-2 text-2xl font-bold text-[#F5F5F5]">
                <Inbox size={24} className="text-[#FF6B35]" />
                Contact Messages
                <span className="text-[#9CA3AF]">({messages.length})</span>
              </h2>
            </div>

            {messageError && (
              <p className="mb-4 rounded-xl border border-[#EF4444]/20 bg-[#EF4444]/10 p-4 text-sm text-[#FCA5A5]">
                {messageError}
              </p>
            )}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {messages.length === 0 && !messageError && (
                <div className="rounded-2xl border border-dashed border-white/[0.12] bg-[#222222] p-8 text-sm text-[#9CA3AF] md:col-span-2 xl:col-span-3">
                  No messages received yet.
                </div>
              )}

              {messages.map((message) => (
                <article
                  key={message.id}
                  className="rounded-2xl border border-white/[0.08] bg-[#222222] p-5 shadow-lg shadow-black/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#FF5A1F]/20 bg-[#FF5A1F]/10 text-sm font-bold text-[#FF6B35]">
                      {message.name.charAt(0).toUpperCase()}
                    </div>

                    <time className="text-right text-xs text-[#6B7280]">
                      {new Date(message.created_at).toLocaleDateString()}
                    </time>
                  </div>

                  <h3 className="mt-4 font-semibold text-[#F5F5F5]">{message.name}</h3>

                  <a
                    href={`mailto:${message.email}`}
                    className="mt-1 block truncate text-sm text-[#FF8A5B] transition-colors duration-150 ease-out hover:text-[#FF6B35] hover:underline"
                  >
                    {message.email}
                  </a>

                  <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-[#9CA3AF]">
                    {message.message}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* TESTIMONIALS */}
          <section id="testimonials" className="scroll-mt-28 mt-12 pb-10">
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#6B7280]">
                Reviews
              </p>

              <h2 className="mt-1 flex items-center gap-2 text-2xl font-bold text-[#F5F5F5]">
                <MessageSquareQuote size={24} className="text-[#FF6B35]" />
                Testimonials Awaiting Approval
                <span className="text-[#9CA3AF]">({testimonials.length})</span>
              </h2>
            </div>

            {testimonialError && (
              <p className="mb-4 rounded-xl border border-[#EF4444]/20 bg-[#EF4444]/10 p-4 text-sm text-[#FCA5A5]">
                {testimonialError}
              </p>
            )}

            {testimonials.length === 0 && !testimonialError ? (
              <div className="rounded-2xl border border-dashed border-white/[0.12] bg-[#222222] p-8 text-sm text-[#9CA3AF]">
                No pending testimonials.
              </div>
            ) : (
              <div className="grid gap-5 lg:grid-cols-2">
                {testimonials.map((testimonial) => (
                  <article
                    key={testimonial.id}
                    className="rounded-2xl border border-white/[0.08] bg-[#222222] p-6 shadow-lg shadow-black/10"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-[#F5F5F5]">
                          {testimonial.client_name}
                        </h3>

                        <p className="mt-1 text-sm text-[#9CA3AF]">
                          {testimonial.project_name}
                        </p>

                        <p
                          className="mt-3 text-sm tracking-wider text-[#FF8A5B]"
                          aria-label={`${testimonial.rating} out of 5 stars`}
                        >
                          {"★".repeat(testimonial.rating)}
                          {"☆".repeat(5 - testimonial.rating)}
                        </p>
                      </div>

                      <time className="text-xs text-[#6B7280]">
                        {new Date(testimonial.created_at).toLocaleDateString()}
                      </time>
                    </div>

                    <p className="mt-5 whitespace-pre-wrap break-words text-sm leading-relaxed text-[#9CA3AF]">
                      "{testimonial.feedback}"
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          void updateTestimonial(testimonial, "approve")
                        }
                        className="flex items-center gap-2 rounded-xl bg-[#A3E635] px-5 py-3 text-sm font-bold text-[#171717] transition-all duration-150 ease-out hover:bg-[#B4F34D] disabled:opacity-50"
                      >
                        <Check size={17} />
                        Approve
                      </button>

                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          void updateTestimonial(testimonial, "reject")
                        }
                        className="flex items-center gap-2 rounded-xl border border-[#EF4444]/20 bg-[#EF4444]/10 px-5 py-3 text-sm font-bold text-[#F87171] transition-all duration-150 ease-out hover:bg-[#EF4444]/20 disabled:opacity-50"
                      >
                        <X size={17} />
                        Reject
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
