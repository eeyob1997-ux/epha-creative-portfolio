"use client";

import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  Heart,
  MessageSquare,
  Star,
  User,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const infoCards = [
  {
    icon: MessageSquare,
    title: "Share your experience",
    subtitle: "Tell us how the project went",
  },
  {
    icon: Star,
    title: "Help others find us",
    subtitle: "Your review shows on our portfolio",
  },
  {
    icon: Heart,
    title: "Support our journey",
    subtitle: "Every word helps us grow",
  },
];

const ratingLabels = [
  "Tap a star",
  "Poor",
  "Fair",
  "Good",
  "Great",
  "Excellent",
];

const sectionReveal = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* Same subtle card as the rest of the page: transparent, no blur, no shadow */
const glass = "rounded-3xl border border-white/[0.06] bg-white/[0.02]";

export default function TestimonialForm() {
  const reduceMotion = useReducedMotion();

  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const shownRating = hoverRating || rating;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: clientName,
          project_name: projectName,
          feedback,
          rating,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || "Something went wrong. Please try again.",
        );
      }

      setSuccess(true);
      setClientName("");
      setProjectName("");
      setFeedback("");
      setRating(0);
      setHoverRating(0);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit your feedback. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  const fieldClass =
    "w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-neutral-500 hover:border-white/20 focus:border-[#ffa94d]/70 focus:bg-white/[0.05]";

  return (
    <section
      id="feedback"
      className="relative mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-8 sm:py-20"
    >
      <motion.div
        variants={staggerContainer}
        initial={reduceMotion ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
        className="relative grid items-start gap-10 md:grid-cols-2"
      >
        {/* Left side */}
        <div className="min-w-0">
          <motion.div variants={sectionReveal}>
            {/* Badge + accent line + title: same style as the other sections */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ffa94d]/25 bg-[#ffa94d]/8 px-4 py-1.5 text-[11px] font-medium uppercase tracking-widest text-[#ffa94d]">
              <MessageSquare size={11} />
              Feedback
            </span>

            <div className="mt-3 h-px w-10 rounded-full bg-gradient-to-r from-[#ffc46b] to-[#ff6a3d]" />

            <h2 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-5xl">
              Worked with me?
              <br />
              <span className="font-serif font-normal italic text-white/45">
                Tell us about it.
              </span>
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-neutral-500">
              Your feedback helps us grow, improve and continue delivering
              creative solutions that make an impact.
            </p>
          </motion.div>

          <div className="mt-8 space-y-3">
            {infoCards.map(({ icon: Icon, title, subtitle }) => (
              <motion.div
                key={title}
                variants={sectionReveal}
                className={`${glass} group flex items-center gap-4 p-3.5 transition-colors hover:border-[#ffa94d]/40`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#ffa94d]/10 text-[#ffa94d]">
                  <Icon size={19} strokeWidth={1.6} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white">{title}</p>
                  <p className="mt-0.5 truncate text-xs text-neutral-500">
                    {subtitle}
                  </p>
                </div>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.08] text-[#ffa94d]/60 transition group-hover:border-[#ffa94d] group-hover:bg-gradient-to-br group-hover:from-[#ffc46b] group-hover:to-[#ff6a3d] group-hover:text-black">
                  <ArrowUpRight size={14} />
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right side: form panel */}
        <motion.div
          variants={sectionReveal}
          className={`${glass} min-w-0 self-start p-4 sm:p-6`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {success ? (
              <motion.div
                key="done"
                initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                role="status"
                className="flex flex-col items-center px-4 py-14 text-center"
              >
                <CheckCircle2 size={42} className="text-[#ffa94d]" />
                <h3 className="mt-4 text-lg font-medium">Thank you!</h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-neutral-500">
                  Your feedback was submitted. It will appear on our portfolio
                  after approval.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="mt-6 rounded-full border border-white/[0.08] bg-white/[0.03] px-6 py-2.5 text-xs font-semibold text-white transition hover:border-[#ffa94d]/60"
                >
                  Send another
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                className="space-y-3"
              >
                <div className="relative">
                  <label htmlFor="clientName" className="sr-only">
                    Your name
                  </label>
                  <User
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
                  />
                  <input
                    id="clientName"
                    name="client_name"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={100}
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Your name"
                    className={fieldClass}
                  />
                </div>

                <div className="relative">
                  <label htmlFor="projectName" className="sr-only">
                    Project or company
                  </label>
                  <Briefcase
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
                  />
                  <input
                    id="projectName"
                    name="project_name"
                    type="text"
                    required
                    maxLength={150}
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Project or company"
                    className={fieldClass}
                  />
                </div>

                {/* Rating row */}
                <fieldset className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5">
                  <legend className="sr-only">
                    How would you rate your experience?
                  </legend>

                  <div
                    className="flex items-center"
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {[1, 2, 3, 4, 5].map((value) => {
                      const active = value <= shownRating;

                      return (
                        <motion.button
                          key={value}
                          type="button"
                          aria-label={`${value} ${value === 1 ? "star" : "stars"}`}
                          aria-pressed={rating === value}
                          whileHover={
                            reduceMotion ? undefined : { scale: 1.15 }
                          }
                          whileTap={reduceMotion ? undefined : { scale: 0.85 }}
                          onMouseEnter={() => setHoverRating(value)}
                          onFocus={() => setHoverRating(value)}
                          onBlur={() => setHoverRating(0)}
                          onClick={() => {
                            setRating(value);
                            setError("");
                          }}
                          className="rounded-md p-1 outline-none focus-visible:ring-2 focus-visible:ring-[#ffa94d]"
                        >
                          <Star
                            size={20}
                            className={`transition-colors duration-200 ${
                              active
                                ? "fill-[#ffa94d] text-[#ffa94d]"
                                : "text-neutral-600"
                            }`}
                          />
                        </motion.button>
                      );
                    })}
                  </div>

                  <span
                    className={`text-xs ${shownRating ? "bg-gradient-to-r from-[#ffc46b] to-[#ff6a3d] bg-clip-text text-transparent" : "text-neutral-500"}`}
                  >
                    {shownRating
                      ? `${shownRating} out of 5 · ${ratingLabels[shownRating]}`
                      : "Rate your experience"}
                  </span>
                </fieldset>

                {/* Message */}
                <div>
                  <label htmlFor="feedback" className="sr-only">
                    Your feedback
                  </label>
                  <textarea
                    id="feedback"
                    name="feedback"
                    required
                    minLength={5}
                    maxLength={2000}
                    rows={6}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share your experience working with us..."
                    className="min-h-[150px] w-full resize-y rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-sm text-white outline-none transition [overflow-wrap:anywhere] placeholder:text-neutral-500 hover:border-white/20 focus:border-[#ffa94d]/70 focus:bg-white/[0.05]"
                  />
                  <p className="px-1 pt-1 text-right text-[11px] text-neutral-600">
                    {feedback.length}/2000
                  </p>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      key="error"
                      initial={reduceMotion ? false : { opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0 }}
                      role="alert"
                      className="rounded-2xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-300"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={loading || rating === 0}
                  className="group flex w-full items-center justify-between rounded-full bg-gradient-to-r from-[#ffc46b] to-[#ff6a3d] py-1.5 pl-6 pr-1.5 text-sm font-semibold text-black shadow-[0_4px_24px_rgba(255,169,77,0.3)] transition hover:shadow-[0_6px_36px_rgba(255,169,77,0.5)] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
                >
                  {loading ? "Submitting..." : "Submit feedback"}
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#050606] text-white">
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </span>
                </button>

                <p className="pt-1 text-center text-[11px] text-neutral-600">
                  Your review will be visible on our portfolio after approval.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
}
