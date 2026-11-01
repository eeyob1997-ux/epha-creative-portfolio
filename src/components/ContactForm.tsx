"use client";

import { useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

const cards = [
  {
    Icon: Mail,
    title: "Email us",
    lines: ["Eeyob1997@gmail.com"],
    href: "mailto:Eeyob1997@gmail.com",
  },
  {
    Icon: Phone,
    title: "Call us",
    lines: ["+251 906 492 021", "+251 913 630 358"],
    href: "tel:+251906492021",
  },
  {
    Icon: MapPin,
    title: "Our location",
    lines: ["Available for remote projects"],
    href: "https://t.me/Ephremeyob",
  },
];

const fieldClass =
  "w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-neutral-400 hover:border-white/20 focus:border-emerald-300/50 focus:bg-white/[0.07]";

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
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      message: String(formData.get("message") || ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Could not send message.");

      setStatus("Thanks! Your message has been sent.");
      formElement.reset();
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setBusy(false);
    }
  }

  const sent = status.startsWith("Thanks");

  return (
    <section
      id="contact"
      className="relative isolate scroll-mt-20 overflow-hidden bg-[#030504]"
    >
      {/* Teal glow at the top */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[460px] w-[900px] max-w-full -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(70,150,125,0.55),rgba(30,70,60,0.25)_45%,transparent_72%)]"
      />

      {/* Big faded CONTACT word */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-10 -z-10 select-none text-center text-[24vw] font-black uppercase leading-none tracking-tight text-white/[0.07] [mask-image:linear-gradient(to_bottom,black_25%,transparent_80%)] md:top-12 md:text-[11rem]"
      >
        Contact
      </div>

      {/* Circuit lines, left and right */}
      <svg
        aria-hidden="true"
        viewBox="0 0 300 200"
        fill="none"
        className="pointer-events-none absolute left-0 top-16 -z-10 hidden h-44 w-72 text-white/40 lg:block"
      >
        <path d="M0 30 L70 95 L150 95" stroke="currentColor" strokeWidth="1" />
        <path
          d="M0 70 L50 120 L105 120"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.5"
        />
        <circle cx="105" cy="120" r="4" stroke="currentColor" />
        <circle cx="150" cy="95" r="4" stroke="currentColor" />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 300 200"
        fill="none"
        className="pointer-events-none absolute right-0 top-16 -z-10 hidden h-44 w-72 -scale-x-100 text-white/40 lg:block"
      >
        <path d="M0 30 L70 95 L150 95" stroke="currentColor" strokeWidth="1" />
        <path
          d="M0 70 L50 120 L105 120"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.5"
        />
        <circle cx="105" cy="120" r="4" stroke="currentColor" />
        <circle cx="150" cy="95" r="4" stroke="currentColor" />
      </svg>

      <div className="relative mx-auto grid max-w-6xl items-start gap-8 px-4 pb-16 pt-24 sm:grid-cols-2 sm:gap-5 sm:px-6 md:gap-6 md:px-8 md:pb-20 md:pt-32">
        {/* Left side */}
        <div className="min-w-0">
          <span className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] p-1.5 pr-5 text-xs font-medium text-white">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.07]">
              <MessageCircle size={13} />
            </span>
            Contact
          </span>

          <h2 className="mt-8 bg-gradient-to-b from-white to-emerald-200/60 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl">
            Get in touch
          </h2>
          <p className="mt-3 max-w-xs text-xs leading-5 text-neutral-400">
            Have questions or ready to transform your brand with creative
            design? Send me a message.
          </p>

          <div className="mt-10 space-y-3">
            {cards.map(({ Icon, title, lines, href }) => (
              <a
                key={title}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-3.5 transition-colors hover:border-white/20"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-white">
                  <Icon size={20} strokeWidth={1.5} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white">{title}</p>
                  {lines.map((line) => (
                    <p
                      key={line}
                      className="mt-0.5 truncate text-xs text-neutral-400"
                    >
                      {line}
                    </p>
                  ))}
                </div>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition group-hover:bg-white group-hover:text-black">
                  <ArrowUpRight size={14} />
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Right side: form */}
        <form
          id="contact-form"
          onSubmit={submit}
          className="min-w-0 space-y-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-1.5"
        >
          <label htmlFor="contact-name" className="sr-only">
            Name
          </label>
          <input
            id="contact-name"
            required
            name="name"
            maxLength={80}
            placeholder="Name"
            className={fieldClass}
          />

          <label htmlFor="contact-email" className="sr-only">
            Email
          </label>
          <input
            id="contact-email"
            required
            type="email"
            name="email"
            maxLength={254}
            placeholder="Email"
            className={fieldClass}
          />

          <label htmlFor="contact-message" className="sr-only">
            Message
          </label>
          <textarea
            id="contact-message"
            required
            name="message"
            maxLength={3000}
            rows={9}
            placeholder="Message"
            className={`${fieldClass} min-h-[250px] resize-y`}
          />

          {status && (
            <p
              role="status"
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs ${
                sent
                  ? "border-emerald-300/30 bg-emerald-300/[0.08] text-emerald-200"
                  : "border-red-500/30 bg-red-500/10 text-red-300"
              }`}
            >
              {sent && <CheckCircle2 size={15} />}
              {status}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Sending..." : "Submit"}
          </button>
        </form>
      </div>
    </section>
  );
}
