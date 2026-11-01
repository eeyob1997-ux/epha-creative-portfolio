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
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" as const },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

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

  // Soft glass field, like the reference design
  const fieldClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-neutral-500 hover:border-white/20 focus:border-[#c9ff27]/70 focus:bg-white/[0.06]";

  return (
    <section
      id="feedback"
      className="relative isolate scroll-mt-20 overflow-hidden bg-[#050605]"
    >
      {/* Green glow at the top */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(ellipse_at_top,rgba(201,255,39,0.16),rgba(40,70,30,0.12)_40%,transparent_70%)]"
      />

      {/* Big faded watermark word */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-6 -z-10 select-none text-center text-[22vw] font-black uppercase leading-none tracking-tight text-white/[0.05] [mask-image:linear-gradient(to_bottom,black_30%,transparent_85%)] md:top-8 md:text-[10rem]"
      >
        Feedback
      </div>

      <motion.div
        variants={staggerContainer}
        initial={reduceMotion ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
        className="relative mx-auto grid max-w-6xl items-start gap-6 px-4 pb-16 pt-24 sm:grid-cols-2 sm:gap-5 sm:px-6 md:gap-8 md:px-8 md:pb-20 md:pt-28"
      >
        {/* Left side */}
        <div className="min-w-0">
          <motion.div variants={sectionReveal}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1 pr-4 text-xs font-medium text-white">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-[#c9ff27]">
                <MessageSquare size={13} />
              </span>
              Feedback
            </span>

            <h2 className="mt-5 text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
              Work with us?
              <br />
              <span className="text-[#c9ff27]">Tell us about it.</span>
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-400">
              Your feedback helps us grow, improve and continue delivering
              creative solutions that make an impact.
            </p>
          </motion.div>

          <div className="mt-8 space-y-3">
            {infoCards.map(({ icon: Icon, title, subtitle }) => (
              <motion.div
                key={title}
                variants={sectionReveal}
                whileHover={reduceMotion ? undefined : { y: -3 }}
                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 md:gap-4 md:p-3.5 transition-colors hover:border-[#c9ff27]/40"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white">
                  <Icon size={19} strokeWidth={1.6} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-0.5 truncate text-xs text-neutral-400">
                    {subtitle}
                  </p>
                </div>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white transition group-hover:border-[#c9ff27] group-hover:bg-[#c9ff27] group-hover:text-black">
                  <ArrowUpRight size={14} />
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right side: form panel */}
        <motion.div
          variants={sectionReveal}
          className="min-w-0 self-start rounded-3xl border border-white/10 bg-white/[0.03] p-2 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.9)]"
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
                <CheckCircle2 size={42} className="text-[#c9ff27]" />
                <h3 className="mt-4 text-lg font-semibold">Thank you!</h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-neutral-400">
                  Your feedback was submitted. It will appear on our portfolio
                  after approval.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="mt-6 rounded-xl bg-white px-6 py-2.5 text-xs font-bold text-black transition hover:bg-[#c9ff27]"
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
                className="space-y-2"
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
                <fieldset className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5">
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
                          aria-label={`${value} ${
                            value === 1 ? "star" : "stars"
                          }`}
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
                          className="rounded-md p-1 outline-none focus-visible:ring-2 focus-visible:ring-[#c9ff27]"
                        >
                          <Star
                            size={20}
                            className={`transition-colors duration-200 ${
                              active
                                ? "fill-[#c9ff27] text-[#c9ff27]"
                                : "text-neutral-600"
                            }`}
                          />
                        </motion.button>
                      );
                    })}
                  </div>

                  <span
                    className={`text-xs ${
                      shownRating ? "text-[#c9ff27]" : "text-neutral-500"
                    }`}
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
                    className="min-h-[150px] w-full resize-y rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition [overflow-wrap:anywhere] placeholder:text-neutral-500 hover:border-white/20 focus:border-[#c9ff27]/70 focus:bg-white/[0.06]"
                  />
                  <p className="px-1 pt-1 text-right text-[11px] text-neutral-500">
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
                      className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* White submit button, like the reference */}
                <button
                  type="submit"
                  disabled={loading || rating === 0}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-black transition hover:bg-[#c9ff27] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Submit feedback"}
                  {!loading && (
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  )}
                </button>

                <p className="pb-1 pt-1 text-center text-[11px] text-neutral-500">
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
