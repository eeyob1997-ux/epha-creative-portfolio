"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

const details = [
  { Icon: Mail,   text: "Eeyob1997@gmail.com",       href: "mailto:Eeyob1997@gmail.com" },
  { Icon: Phone,  text: "+251 906 492 021",            href: "tel:+251906492021" },
  { Icon: MapPin, text: "Available for remote projects", href: "" },
];

const fieldClass =
  "w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-neutral-600 hover:border-white/[0.14] focus:border-[#ffa94d]/60 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(255,169,77,0.08)]";

export default function ContactSection() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    setBusy(true);
    setStatus("");

    const payload = {
      name:    String(formData.get("name")    || ""),
      email:   String(formData.get("email")   || ""),
      message: String(formData.get("message") || ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not send message.");
      setStatus("Message sent successfully. Thank you!");
      formElement.reset();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const sent = status.startsWith("Message sent");

  return (
    <section
      id="contact"
      className="relative scroll-mt-20 overflow-hidden px-4 py-24 sm:px-8"
    >
      {/* Section divider */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
      />

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 h-[400px] w-[700px] max-w-full -translate-x-1/2 rounded-full bg-[#ffa94d] opacity-[0.04] blur-[80px]"
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 md:grid-cols-[1fr_1.15fr] md:items-center">

        {/* Left — heading + contact details */}
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[11px] text-white/70 tracking-wide">
            Contact
          </span>
          <p className="mt-6 text-xl text-neutral-500 sm:text-2xl">
            Let&apos;s start
          </p>
          <h2 className="mt-1 text-5xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl">
            Create something
            <br />
            <span className="font-serif italic font-normal text-white/40">
              great together
            </span>
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-7 text-neutral-500">
            Have a project in mind or just want to say hello? Reach out —
            I&apos;d love to hear from you.
          </p>

          <div className="mt-8 flex flex-col items-start gap-2.5">
            {details.map(({ Icon, text, href }) => {
              const content = (
                <>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#ffa94d]/20 bg-[#ffa94d]/10">
                    <Icon className="text-[#ffa94d]" size={14} />
                  </span>
                  <span className="break-all">{text}</span>
                </>
              );
              const base =
                "inline-flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-xs text-neutral-300 transition";

              return href ? (
                <a
                  key={text}
                  href={href}
                  className={`${base} hover:border-[#ffa94d]/30 hover:bg-[#ffa94d]/[0.04] hover:text-white`}
                >
                  {content}
                  <ArrowUpRight size={13} className="ml-auto text-neutral-600 transition group-hover:text-[#ffa94d]" />
                </a>
              ) : (
                <p key={text} className={base}>
                  {content}
                </p>
              );
            })}
          </div>
        </div>

        {/* Right — form card */}
        <form
          onSubmit={submit}
          className="min-w-0 space-y-3 rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8"
        >
          <h3 className="mb-5 text-base font-semibold text-white">
            Send a message
          </h3>

          <div className="grid gap-3 sm:grid-cols-2">
            <label htmlFor="contact-name" className="sr-only">Name</label>
            <input
              id="contact-name"
              required
              name="name"
              maxLength={80}
              placeholder="Your name"
              className={fieldClass}
            />
            <label htmlFor="contact-email" className="sr-only">Email</label>
            <input
              id="contact-email"
              required
              type="email"
              name="email"
              maxLength={254}
              placeholder="Your email"
              className={fieldClass}
            />
          </div>

          <label htmlFor="contact-message" className="sr-only">Message</label>
          <textarea
            id="contact-message"
            required
            name="message"
            maxLength={3000}
            rows={5}
            placeholder="Tell me about your project…"
            className={`${fieldClass} min-h-[140px] resize-y`}
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              type="submit"
              disabled={busy}
              className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#ffc46b] to-[#ff6a3d] py-1.5 pl-6 pr-1.5 text-sm font-semibold text-black shadow-[0_4px_24px_rgba(255,169,77,0.3)] transition hover:shadow-[0_6px_32px_rgba(255,169,77,0.5)] hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55"
            >
              {busy ? "Sending…" : "Send message"}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white transition group-hover:bg-black/50">
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </span>
            </button>

            {status && (
              <p
                role="status"
                className={`text-xs ${
                  sent
                    ? "bg-gradient-to-r from-[#ffc46b] to-[#ff6a3d] bg-clip-text text-transparent"
                    : "text-red-400"
                }`}
              >
                {status}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
