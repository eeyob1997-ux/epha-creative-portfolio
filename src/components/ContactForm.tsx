"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(formData: FormData) {
    setBusy(true); setStatus("");
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      message: String(formData.get("message") || "")
    };
    try {
      const response = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not send message.");
      setStatus("Thanks! Your message has been sent.");
      (document.getElementById("contact-form") as HTMLFormElement | null)?.reset();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Something went wrong.");
    } finally { setBusy(false); }
  }

  return (
    <form id="contact-form" action={submit} className="flex flex-col gap-4">
      <label className="text-xs uppercase tracking-wider">Your name<input required name="name" maxLength={80} className="mt-2 w-full border-b border-ink/30 bg-transparent px-0 py-3 outline-none placeholder:text-ink/45 focus:border-ink" placeholder="Name" /></label>
      <label className="text-xs uppercase tracking-wider">Email address<input required type="email" name="email" maxLength={254} className="mt-2 w-full border-b border-ink/30 bg-transparent px-0 py-3 outline-none placeholder:text-ink/45 focus:border-ink" placeholder="you@example.com" /></label>
      <label className="text-xs uppercase tracking-wider">Tell me about your project<textarea required name="message" maxLength={3000} rows={3} className="mt-2 w-full resize-y border-b border-ink/30 bg-transparent px-0 py-3 outline-none placeholder:text-ink/45 focus:border-ink" placeholder="A little about what you have in mind..." /></label>
      <button disabled={busy} className="mt-3 flex w-fit items-center gap-3 rounded-full bg-ink px-6 py-3 text-sm text-white transition hover:bg-ink/80 disabled:opacity-50">{busy ? "Sending..." : "Send message"} <ArrowUpRight size={17}/></button>
      {status && <p role="status" className="flex items-center gap-2 text-sm">{status.startsWith("Thanks") && <CheckCircle2 size={16}/>} {status}</p>}
    </form>
  );
}
