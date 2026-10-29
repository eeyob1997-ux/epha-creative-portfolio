"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, MessageSquare, Star, Heart } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const features = [
  { icon: MessageSquare, title: "SHARE YOUR", subtitle: "EXPERIENCE" },
  { icon: Star, title: "HELP OTHERS", subtitle: "FIND US" },
  { icon: Heart, title: "SUPPORT", subtitle: "OUR JOURNEY" },
];

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

  const reveal = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay, ease },
        };

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

  const inputClass =
    "w-full rounded-lg border border-lime-400/20 bg-[#090b08] px-3.5 py-2.5 text-sm text-white outline-none transition duration-300 placeholder:text-slate-400 hover:border-lime-400/50 focus:border-lime-400 focus:ring-2 focus:ring-lime-400/15";

  return (
    <section className="relative isolate overflow-hidden bg-[#080909] px-4 py-10 text-white sm:px-6 sm:py-12 lg:min-h-[calc(100vh-80px)] lg:py-14">
      {/* Soft lime background accents */}
      <motion.div
        aria-hidden="true"
        animate={reduceMotion ? undefined : { x: [0, 10, 0], y: [0, 8, 0] }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -left-40 top-24 -z-10 h-64 w-64 rounded-full bg-lime-400/[0.07] blur-3xl"
      />

      <motion.div
        aria-hidden="true"
        animate={
          reduceMotion
            ? undefined
            : { opacity: [0.12, 0.25, 0.12], scale: [1, 1.08, 1] }
        }
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -right-40 bottom-0 -z-10 h-72 w-72 rounded-full bg-lime-400/[0.06] blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.08fr] lg:gap-12">
          {/* Left content */}
          <motion.div {...reveal(0.05)}>
            <div className="mb-5 flex items-center gap-6">
              <span className="text-xs font-semibold tracking-[0.25em] text-lime-400 sm:text-sm">
                CLIENT FEEDBACK
              </span>
              <span className="h-[2px] w-20 bg-lime-400" />
            </div>

            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.5rem]">
              Work with us?
              <br />
              <span className="text-lime-400">Tell us about it.</span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
              Your feedback helps us grow, improve and continue delivering
              creative solutions that make an impact.
            </p>

            {/* Three feature highlights */}
            <div className="mt-10 grid grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={feature.title}
                    {...reveal(0.12 + index * 0.1)}
                    whileHover={reduceMotion ? undefined : { y: -3 }}
                    className={`flex flex-col items-start gap-3 ${
                      index === 0
                        ? "pr-2"
                        : "border-l border-lime-400/30 pl-3 sm:pl-6"
                    }`}
                  >
                    <motion.div
                      whileHover={reduceMotion ? undefined : { scale: 1.08 }}
                      transition={{ duration: 0.2 }}
                      className="text-lime-400"
                    >
                      <Icon size={31} strokeWidth={1.7} />
                    </motion.div>

                    <p className="text-[10px] font-semibold leading-5 tracking-[0.13em] text-lime-400 sm:text-xs sm:tracking-[0.16em]">
                      {feature.title}
                      <br />
                      {feature.subtitle}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Feedback card */}
          <motion.div
            {...reveal(0.16)}
            whileHover={reduceMotion ? undefined : { y: -2 }}
            className="relative rounded-2xl border-[0.2px] border-lime-400/30 bg-[#10120d] p-4 shadow-[0_0_24px_rgba(163,230,53,0.06)] transition-colors duration-300 hover:border-lime-400/50 sm:p-6 lg:p-7"
          >
            {/* Decorative corner accent */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-0 top-0 h-20 w-20 rounded-tr-2xl border-r border-t border-lime-400/20"
            />

            <form onSubmit={handleSubmit} className="relative space-y-5">
              <div>
                <label
                  htmlFor="clientName"
                  className="mb-1.5 block text-sm font-medium text-white"
                >
                  Your name <span className="text-lime-400">*</span>
                </label>
                <input
                  id="clientName"
                  name="client_name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={100}
                  value={clientName}
                  onChange={(event) => setClientName(event.target.value)}
                  placeholder="Enter your name"
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="projectName"
                  className="mb-1.5 block text-sm font-medium text-white"
                >
                  Project or company <span className="text-lime-400">*</span>
                </label>
                <input
                  id="projectName"
                  name="project_name"
                  type="text"
                  required
                  maxLength={150}
                  value={projectName}
                  onChange={(event) => setProjectName(event.target.value)}
                  placeholder="What did we work on?"
                  className={inputClass}
                />
              </div>
              <fieldset>
                <legend className="mb-2.5 text-sm font-medium text-white">
                  How would you rate your experience?{" "}
                  <span className="text-lime-400">*</span>
                </legend>

                <div className="flex flex-wrap items-center gap-1">
                  {[1, 2, 3, 4, 5].map((value) => {
                    const active = value <= (hoverRating || rating);

                    return (
                      <motion.button
                        key={value}
                        type="button"
                        aria-label={`${value} ${
                          value === 1 ? "star" : "stars"
                        }`}
                        aria-pressed={rating === value}
                        whileHover={
                          reduceMotion ? undefined : { scale: 1.12, y: -2 }
                        }
                        whileTap={reduceMotion ? undefined : { scale: 0.88 }}
                        onMouseEnter={() => setHoverRating(value)}
                        onMouseLeave={() => setHoverRating(0)}
                        onFocus={() => setHoverRating(value)}
                        onBlur={() => setHoverRating(0)}
                        onClick={() => {
                          setRating(value);
                          setError("");
                        }}
                        className="rounded-md p-1 outline-none focus-visible:ring-2 focus-visible:ring-lime-400"
                      >
                        <motion.span
                          animate={
                            reduceMotion
                              ? undefined
                              : { scale: active ? 1.05 : 1 }
                          }
                          className="block"
                        >
                          <Star
                            className={`transition-colors duration-200 ${
                              active
                                ? "fill-[#c5ff41] text-[#c5ff41]"
                                : "text-[#c5ff41]/70"
                            }`}
                          />
                        </motion.span>
                      </motion.button>
                    );
                  })}

                  <span className="ml-2 text-xs text-slate-300 sm:text-sm">
                    {hoverRating || rating} out of 5
                  </span>
                </div>
              </fieldset>
              <div>
                <label
                  htmlFor="feedback"
                  className="mb-1.5 block text-sm font-medium text-white"
                >
                  Your feedback <span className="text-lime-400">*</span>
                </label>
                <textarea
                  id="feedback"
                  name="feedback"
                  required
                  minLength={5}
                  maxLength={2000}
                  rows={3}
                  value={feedback}
                  onChange={(event) => setFeedback(event.target.value)}
                  placeholder="Share your experience working with us..."
                  className={`${inputClass} min-h-28 min-w-0 resize-y [overflow-wrap:anywhere]`}
                />
                <p className="mt-1.5 text-right text-xs text-slate-300">
                  {feedback.length}/2000
                </p>
              </div>
              <AnimatePresence mode="wait">
                {error && (
                  <motion.p
                    key="error"
                    initial={reduceMotion ? false : { opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0 }}
                    role="alert"
                    className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-300"
                  >
                    {error}
                  </motion.p>
                )}

                {success && (
                  <motion.p
                    key="success"
                    initial={reduceMotion ? false : { opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0 }}
                    role="status"
                    className="rounded-lg border border-lime-400/30 bg-lime-400/[0.08] px-3 py-2.5 text-sm text-lime-300"
                  >
                    Thank you! Your feedback has been submitted successfully.
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Visible animated submit button */}
              <motion.button
                type="submit"
                disabled={loading || rating === 0}
                whileHover={
                  reduceMotion || loading || rating === 0
                    ? undefined
                    : { scale: 1.015 }
                }
                whileTap={
                  reduceMotion || loading || rating === 0
                    ? undefined
                    : { scale: 0.98 }
                }
                className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#c5ff41] px-5 py-3.5 text-sm font-semibold text-black shadow-lg transition-colors duration-300 hover:bg-[#b7f52e] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit feedback"}
                {!loading && (
                  <ArrowRight
                    size={19}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                )}
              </motion.button>

              <p className="text-center text-xs leading-5 text-slate-300">
                Your review will be visible on our portfolio after approval.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
