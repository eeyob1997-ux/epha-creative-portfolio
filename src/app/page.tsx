"use client";

import ContactSection from "@/components/ContactSection";
import TestimonialForm from "../components/TestimonialForm";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import { Rubik } from "next/font/google";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Mail,
  Phone,
  Pencil,
  Image as ImageIcon,
  LayoutGrid,
  Monitor,
  Instagram,
  Send,
  Menu,
  X,
  Github,
  Sparkles,
  Star,
} from "lucide-react";

const brandFont = Rubik({ subsets: ["latin"], weight: ["600", "700"] });

/* ── Logo mask ─────────────────────────────────────── */
function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  const mask = {
    WebkitMaskImage: "url(/logo.png)",
    maskImage: "url(/logo.png)",
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
  } as const;
  return (
    <span
      role="img"
      aria-label="Creative logo"
      className={`inline-block bg-gradient-to-br from-[#ffc46b] to-[#ff6a3d] ${className}`}
      style={mask}
    />
  );
}

/* ── Types ─────────────────────────────────────────── */
type Project = {
  id: string;
  title: string;
  category: string;
  image_url: string;
  published: boolean;
  client?: string | null;
};
type Testimonial = {
  id: string;
  client_name: string;
  project_name: string;
  feedback: string;
  rating: number;
  created_at: string;
};

/* ── Static data ───────────────────────────────────── */
const services = [
  {
    title: "Branding",
    description:
      "Logos, brand identity and visual systems that make your brand unforgettable.",
    Icon: Pencil,
    accent: "from-[#ffc46b]/20 to-[#ff6a3d]/5",
  },
  {
    title: "Social Media",
    description:
      "Eye-catching posts, story templates, reels covers and ad creatives.",
    Icon: ImageIcon,
    accent: "from-[#f472b6]/20 to-[#fb923c]/5",
  },
  {
    title: "Print Design",
    description:
      "Premium flyers, brochures, business cards and event materials.",
    Icon: LayoutGrid,
    accent: "from-[#34d399]/20 to-[#059669]/5",
  },
  {
    title: "Graphic Design",
    description:
      "Creative visuals for any purpose — posters, packaging, presentations.",
    Icon: Monitor,
    accent: "from-[#60a5fa]/20 to-[#3b82f6]/5",
  },
];

const skills = [
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Adobe Premiere Pro",
  "Adobe After Effects",
  "CapCut",
];

const navigation = [
  ["Home", "#home"],
  ["Portfolio", "#portfolio"],
  ["About", "#about"],
  ["Services", "#services"],
  ["Testimonials", "#testimonials"],
  ["Contact", "#contact"],
];

const stats = [
  { value: 2, suffix: "+", label: "Years\nExperience" },
  { value: 50, suffix: "+", label: "Projects\nCompleted" },
  { value: 40, suffix: "+", label: "Happy\nClients" },
];

/* ── Animation variants ────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};
const fadeIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const staggerSm = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

/* ── Animated stat counter ─────────────────────────── */
function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(to / 30);
    const timer = setInterval(() => {
      start += step;
      if (start >= to) {
        setCount(to);
        clearInterval(timer);
      } else setCount(start);
    }, 40);
    return () => clearInterval(timer);
  }, [inView, to]);

  return (
    <span
      ref={ref}
      className="stat-number bg-gradient-to-r from-[#ffc46b] to-[#ff6a3d] bg-clip-text text-transparent"
    >
      {count}
      {suffix}
    </span>
  );
}

/* ── Floating particles strip ──────────────────────── */
function Particles() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: `${(i * 5.8 + 3) % 100}%`,
            bottom: `${(i * 7 + 10) % 40}%`,
            animationDuration: `${3.5 + (i % 5) * 0.8}s`,
            animationDelay: `${(i * 0.4) % 4}s`,
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
          }}
        />
      ))}
    </div>
  );
}

/* ── 3D Mouse-tracking portrait card ──────────────── */
function HeroPortrait({
  portraitSmooth,
}: {
  portraitSmooth: ReturnType<typeof useSpring>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -10, y: dx * 10 });
  }
  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, x: 60, rotateY: -20 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        perspective: "1000px",
        rotateX: tilt.x,
        rotateY: tilt.y,
        transformStyle: "preserve-3d",
      }}
      className="relative w-full"
    >
      {/* Outer glow ring — rotates behind card */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        aria-hidden
        className="pointer-events-none absolute -inset-3 rounded-[2rem] border border-[#ffa94d]/10"
        style={{ transformStyle: "preserve-3d" }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        aria-hidden
        className="pointer-events-none absolute -inset-6 rounded-[2.5rem] border border-[#ff6a3d]/[0.06]"
      />

      {/* Amber glow blob behind the card */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.38, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
        className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[#ffc46b]/25 to-[#ff6a3d]/15 blur-2xl"
      />

      {/* Card surface */}
      <div
        className="relative overflow-hidden rounded-[1.6rem] border border-white/[0.08] bg-white/[0.025] shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
        style={{ transform: "translateZ(20px)" }}
      >
        {/* Portrait image */}
        <motion.img
          src="/image%20(2).png"
          alt="Ephrem Eyob, Graphic Designer"
          style={{ y: portraitSmooth }}
          className="block h-[520px] w-full object-cover object-top sm:h-[560px]"
        />

        {/* Gradient overlay bottom */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-48"
          style={{
            background:
              "linear-gradient(to top, rgba(5,6,6,0.92) 0%, rgba(5,6,6,0.5) 50%, transparent 100%)",
          }}
        />

        {/* Bottom info strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          style={{ transform: "translateZ(25px)" }}
          className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3"
        >
          <div>
            <p className="text-sm font-bold text-white">Ephrem Eyob</p>
            <p className="text-[11px] text-[#ffa94d]">Graphic Designer</p>
          </div>
          <motion.a
            href="#portfolio"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#ffc46b] to-[#ff6a3d] text-black shadow-[0_4px_16px_rgba(255,169,77,0.5)]"
          >
            <ArrowUpRight size={16} />
          </motion.a>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ── Section title ─────────────────────────────────── */
function SectionTitle({
  badge,
  before,
  italic,
  text,
}: {
  badge: string;
  before: string;
  italic: string;
  text?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="mx-auto mb-16 flex max-w-2xl flex-col items-center text-center"
    >
      <motion.span
        whileHover={{ scale: 1.05 }}
        className="inline-flex items-center gap-1.5 rounded-full border border-[#ffa94d]/25 bg-[#ffa94d]/8 px-4 py-1.5 text-[11px] font-medium tracking-widest text-[#ffa94d] uppercase"
      >
        <Sparkles size={10} />
        {badge}
      </motion.span>

      {/* animated accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="mt-3 h-px w-10 origin-left rounded-full bg-gradient-to-r from-[#ffc46b] to-[#ff6a3d]"
      />

      <h2 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-5xl">
        {before}{" "}
        <span className="font-serif italic font-normal text-white/45">
          {italic}
        </span>
      </h2>
      {text && (
        <p className="mt-4 max-w-md text-sm leading-6 text-neutral-500">
          {text}
        </p>
      )}
    </motion.div>
  );
}

/* ── Main page ─────────────────────────────────────── */
export default function Home() {
  const [showAllFeedback, setShowAllFeedback] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const lastY = useRef(0);

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsLoaded, setTestimonialsLoaded] = useState(false);

  /* typewriter */
  const roles = [
    "Graphic Designer",
    "Brand Identity",
    "Visual Storyteller",
    "Creative Director",
  ];
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const target = roles[roleIdx];
    if (typing) {
      if (displayed.length < target.length) {
        const t = setTimeout(
          () => setDisplayed(target.slice(0, displayed.length + 1)),
          65,
        );
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 1800);
        return () => clearTimeout(t);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
        return () => clearTimeout(t);
      } else {
        setRoleIdx((p) => (p + 1) % roles.length);
        setTyping(true);
      }
    }
  }, [displayed, typing, roleIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  /* custom cursor */
  useEffect(() => {
    const dot = document.getElementById("custom-cursor");
    const ring = document.getElementById("custom-cursor-ring");
    if (!dot || !ring) return;
    let rx = 0,
      ry = 0;
    function move(e: MouseEvent) {
      dot!.style.left = e.clientX + "px";
      dot!.style.top = e.clientY + "px";
      rx += (e.clientX - rx) * 0.12;
      ry += (e.clientY - ry) * 0.12;
      ring!.style.left = rx + "px";
      ring!.style.top = ry + "px";
    }
    let raf: number;
    function loop() {
      raf = requestAnimationFrame(loop);
    }
    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* scroll watcher */
  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setScrolled(y > 40);
      setNavHidden(y > 160 && y > lastY.current);
      lastY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* data loading */
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
                typeof p.image_url === "string",
            ),
          );
      } finally {
        if (!cancelled) setProjectsLoaded(true);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const r = await fetch("/api/testimonials", { cache: "no-store" });
        if (!r.ok) return;
        const d: unknown = await r.json();
        if (!cancelled)
          setTestimonials(Array.isArray(d) ? (d as Testimonial[]) : []);
      } finally {
        if (!cancelled) setTestimonialsLoaded(true);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  /* intersection observer for active nav */
  useEffect(() => {
    const ids = navigation.map(([, h]) => h.slice(1));
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  /* hero parallax */
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const portraitY = useTransform(heroScroll, [0, 1], [0, 80]);
  const portraitSmooth = useSpring(portraitY, { stiffness: 80, damping: 20 });

  /* derived */
  const displayed2 = projects.slice(0, 6);
  const displayedT = showAllFeedback ? testimonials : testimonials.slice(0, 3);

  /* shared tokens */
  const glass =
    "rounded-3xl border border-white/[0.07] bg-white/[0.025] backdrop-blur-xl";
  const pill =
    "rounded-full border border-white/[0.08] bg-white/[0.03] text-white/70 transition hover:border-[#ffa94d]/50 hover:text-white";
  const btn =
    "inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ffc46b] to-[#ff6a3d] px-6 py-3 text-sm font-semibold text-black shadow-[0_4px_24px_rgba(255,169,77,0.3)] transition hover:shadow-[0_6px_36px_rgba(255,169,77,0.5)] hover:scale-[1.03] active:scale-[0.98]";

  return (
    <>
      {/* Custom cursor */}
      <div id="custom-cursor" aria-hidden="true" />
      <div id="custom-cursor-ring" aria-hidden="true" />

      <main className="min-h-screen overflow-hidden bg-[#050606] text-white">
        {/* ── NAV ──────────────────────────────────────── */}
        <motion.header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: navHidden && !menuOpen ? -100 : 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 top-3 z-50 px-3 sm:px-6"
        >
          <div
            className={`mx-auto max-w-6xl rounded-2xl transition-all duration-300 ${
              scrolled || menuOpen
                ? "border border-white/[0.07] bg-[#050606]/85 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
                : "bg-transparent"
            }`}
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              {/* Logo */}
              <a
                href="#home"
                aria-label="Creative home"
                onClick={() => setMenuOpen(false)}
                className="flex min-w-0 items-center gap-[0.1em]"
              >
                <LogoMark className="h-[2.2em] w-[2.2em] shrink-0" />
                <span
                  className={`${brandFont.className} whitespace-nowrap text-lg font-semibold leading-none tracking-[0.08em]`}
                >
                  <span className="text-white">Epha Creative</span>
                </span>
              </a>

              {/* Desktop nav */}
              <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 lg:flex">
                {navigation.map(([label, href]) => {
                  const active = activeSection === href.slice(1);
                  return (
                    <motion.a
                      key={label}
                      href={href}
                      aria-current={active ? "true" : undefined}
                      whileHover={{ scale: 1.05 }}
                      className={`relative rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                        active
                          ? "border-[#ffa94d]/30 bg-[#ffa94d]/10 text-[#ffa94d]"
                          : "border-transparent text-white/50 hover:text-white"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full border border-[#ffa94d]/30 bg-[#ffa94d]/10"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 32,
                          }}
                        />
                      )}
                      <span className="relative">{label}</span>
                    </motion.a>
                  );
                })}
              </nav>

              <div className="flex shrink-0 items-center gap-2">
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="lets-talk hidden rounded-full border border-white/[0.1] px-4 py-2 text-xs font-semibold text-white/70 transition hover:border-[#ffa94d]/50 hover:bg-[#ffa94d]/8 hover:text-[#ffa94d] sm:inline-block"
                >
                  Let&apos;s Talk
                </motion.a>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((p) => !p)}
                  className={`${pill} flex h-10 w-10 items-center justify-center lg:hidden`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={menuOpen ? "x" : "menu"}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {menuOpen ? <X size={18} /> : <Menu size={18} />}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
              {menuOpen && (
                <motion.nav
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#080909]/95 p-2 backdrop-blur-2xl lg:hidden"
                >
                  <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col gap-0.5"
                  >
                    {navigation.map(([label, href]) => (
                      <motion.a
                        key={label}
                        href={href}
                        variants={fadeUp}
                        onClick={() => setMenuOpen(false)}
                        className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                          activeSection === href.slice(1)
                            ? "bg-[#ffa94d]/10 text-[#ffa94d]"
                            : "text-white/70 hover:bg-white/[0.04] hover:text-white"
                        }`}
                      >
                        {label}
                      </motion.a>
                    ))}
                    <motion.a
                      variants={fadeUp}
                      href="#contact"
                      onClick={() => setMenuOpen(false)}
                      className="mt-1 rounded-xl bg-gradient-to-r from-[#ffc46b] to-[#ff6a3d] px-4 py-3 text-center text-sm font-semibold text-black"
                    >
                      Let&apos;s Talk
                    </motion.a>
                  </motion.div>
                </motion.nav>
              )}
            </AnimatePresence>
          </div>
        </motion.header>

        {/* ── HERO ─────────────────────────────────────── */}
        <section
          id="home"
          className="relative scroll-mt-0 overflow-hidden px-4 pb-8 pt-28 sm:px-8 sm:pt-32"
        >
          {/* ── Ambient orbs ── */}
          <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
            <motion.div
              animate={{ scale: [1, 1.18, 1], opacity: [0.06, 0.13, 0.06] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#ffa94d] blur-[140px]"
            />
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.03, 0.08, 0.03] }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
              className="absolute -bottom-32 left-[10%] h-[480px] w-[480px] rounded-full bg-[#ff6a3d] blur-[120px]"
            />
          </div>

          <div className="relative z-10 mx-auto max-w-6xl">
            {/* ── GRID: left content | right portrait card ── */}
            <div className="grid items-center gap-12 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px]">
              {/* ─── LEFT COLUMN ─── */}
              <div className="flex flex-col">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.2 }}
                  className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-[#ffa94d]/25 bg-[#ffa94d]/[0.08] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-widest text-[#ffa94d]"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ffa94d] opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ffa94d]" />
                  </span>
                  Available for Work
                </motion.div>

                {/* 3-D staggered heading */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.1 } },
                  }}
                  style={{ perspective: "700px" }}
                  className="mb-6"
                >
                  {[
                    { text: "Designing Bold", accent: false },
                    { text: "Visual", accent: false },
                    { text: "Identities.", accent: true },
                  ].map(({ text, accent }) => (
                    <motion.h1
                      key={text}
                      variants={{
                        hidden: {
                          opacity: 0,
                          y: 44,
                          rotateX: -30,
                          filter: "blur(10px)",
                        },
                        visible: {
                          opacity: 1,
                          y: 0,
                          rotateX: 0,
                          filter: "blur(0px)",
                          transition: {
                            duration: 0.75,
                            ease: "easeOut" as const,
                          },
                        },
                      }}
                      style={{
                        transformOrigin: "top left",
                        transformStyle: "preserve-3d",
                        display: "block",
                      }}
                      className={`${brandFont.className} text-[2.8rem] font-black leading-[1.04] tracking-[-0.03em] sm:text-[3.6rem] lg:text-[4.2rem] xl:text-[4.8rem] ${
                        accent
                          ? "bg-gradient-to-r from-[#ffc46b] to-[#ff6a3d] bg-clip-text text-transparent"
                          : "text-white"
                      }`}
                    >
                      {text}
                    </motion.h1>
                  ))}
                </motion.div>

                {/* Body */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.7 }}
                  className="mb-8 max-w-md text-sm leading-[1.85] text-neutral-500 sm:text-base"
                >
                  I craft clean, purposeful designs that help brands connect
                  with their audience. With a passion for brand storytelling and
                  visual systems, I create identities that are not just
                  beautiful — but memorable and effective.
                </motion.p>

                {/* Signature */}
                <motion.div
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.75, delay: 0.9 }}
                  className="mb-8"
                >
                  <span
                    className="text-[1.9rem] text-white/40 sm:text-[2.2rem]"
                    style={{ fontFamily: "var(--font-caveat), cursive" }}
                  >
                    Ephrem Eyob
                  </span>
                </motion.div>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.05 }}
                  className="flex flex-wrap items-center gap-3"
                >
                  <motion.a
                    href="#portfolio"
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#ffc46b] to-[#ff6a3d] py-3 pl-6 pr-3 text-sm font-bold text-black shadow-[0_4px_28px_rgba(255,169,77,0.35)] transition hover:shadow-[0_8px_44px_rgba(255,169,77,0.55)]"
                  >
                    See my work
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/20 transition group-hover:bg-black/35">
                      <ArrowRight size={15} />
                    </span>
                  </motion.a>

                  <motion.a
                    href="#contact"
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-6 py-3 text-sm font-medium text-white/60 backdrop-blur-sm transition hover:border-[#ffa94d]/40 hover:bg-[#ffa94d]/[0.06] hover:text-white"
                  >
                    Let&apos;s Talk
                  </motion.a>
                </motion.div>

                {/* Typewriter */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                  className="mt-8 flex items-center gap-2"
                >
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                    Role —
                  </span>
                  <span className="text-sm font-semibold text-[#ffa94d]">
                    {displayed}
                    <span className="tw-cursor" />
                  </span>
                </motion.div>
              </div>

              {/* ─── RIGHT COLUMN — 3D portrait card ─── */}
              <HeroPortrait portraitSmooth={portraitSmooth} />
            </div>

            {/* ── 3D Stats bar ── */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.3 }}
              className="mt-14 grid grid-cols-3 gap-3 sm:gap-4"
            >
              {[
                { value: 2, suffix: "+", label: "Years Experience", icon: "✦" },
                {
                  value: 50,
                  suffix: "+",
                  label: "Projects Completed",
                  icon: "◈",
                },
                { value: 40, suffix: "+", label: "Happy Clients", icon: "❋" },
              ].map(({ value, suffix, label, icon }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 24, rotateX: -20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.55,
                    delay: 1.35 + i * 0.1,
                    ease: "easeOut",
                  }}
                  whileHover={{ y: -4, scale: 1.02, rotateX: -4 }}
                  style={{
                    transformStyle: "preserve-3d",
                    perspective: "400px",
                  }}
                  className="group flex flex-col items-center rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-5 text-center backdrop-blur-sm transition-colors hover:border-[#ffa94d]/25"
                >
                  <span className="mb-1 text-[11px] text-[#ffa94d]/50 group-hover:text-[#ffa94d]">
                    {icon}
                  </span>
                  <p className="text-2xl font-bold sm:text-3xl">
                    <Counter to={value} suffix={suffix} />
                  </p>
                  <p className="mt-1 text-[11px] leading-4 text-neutral-600 sm:text-xs">
                    {label}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* ── Scroll indicator ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.9, duration: 0.6 }}
              className="mt-10 flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 7, 0] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex flex-col items-center gap-1.5 text-white/20"
              >
                <span className="text-[9px] uppercase tracking-widest">
                  Scroll
                </span>
                <ArrowDown size={12} />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── PORTFOLIO ────────────────────────────────── */}
        <section
          id="portfolio"
          className="relative scroll-mt-20 px-4 py-24 sm:px-8"
        >
          <div className="sep absolute inset-x-0 top-0" />
          <div className="mx-auto max-w-6xl">
            <SectionTitle
              badge="My work"
              before="Recent"
              italic="projects"
              text="A curated collection of my latest design work."
            />

            {!projectsLoaded ? (
              <div className="flex items-center justify-center gap-3 py-16 text-sm text-neutral-600">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-[#ffa94d]" />
                Loading…
              </div>
            ) : projects.length === 0 ? (
              <p className="py-12 text-center text-sm text-neutral-600">
                No projects yet.
              </p>
            ) : (
              <>
                <div className="columns-2 gap-3 sm:gap-4 lg:columns-3">
                  <AnimatePresence mode="popLayout">
                    {displayed2.map((p, i) => (
                      <motion.article
                        layout
                        key={p.id}
                        initial={{ opacity: 0, y: 28, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.88 }}
                        transition={{ duration: 0.4, delay: i * 0.04 }}
                        className="card-hover group mb-3 break-inside-avoid overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] sm:mb-4"
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={p.image_url}
                            alt={p.title}
                            loading="lazy"
                            className="block h-auto w-full transition-transform duration-700 group-hover:scale-[1.07]"
                          />
                          <motion.div
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"
                          />
                        </div>
                        <div className="flex items-center justify-between gap-2 p-3.5 sm:p-4">
                          <div className="min-w-0">
                            <h3 className="truncate text-xs font-semibold sm:text-sm">
                              {p.title}
                            </h3>
                            <p className="mt-0.5 truncate text-[10px] text-neutral-600 sm:text-xs">
                              {p.category} · {p.client ?? "Personal"}
                            </p>
                          </div>
                          <motion.span
                            whileHover={{ rotate: 45, scale: 1.1 }}
                            aria-hidden
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.08] text-[#ffa94d]/60 transition-all group-hover:border-[#ffa94d] group-hover:bg-gradient-to-br group-hover:from-[#ffc46b] group-hover:to-[#ff6a3d] group-hover:text-black"
                          >
                            <ArrowUpRight size={14} />
                          </motion.span>
                        </div>
                      </motion.article>
                    ))}
                  </AnimatePresence>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="mt-10 flex justify-center"
                >
                  <Link
                    href="/portfolio"
                    className={`${pill} group inline-flex items-center gap-2 px-7 py-3 text-sm`}
                  >
                    View all projects
                    <ArrowRight
                      size={15}
                      className="transition group-hover:translate-x-1"
                    />
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </section>

        {/* ── ABOUT ────────────────────────────────────── */}
        <section
          id="about"
          className="relative mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-8"
        >
          <div className="sep absolute inset-x-0 top-0" />
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            className={`${glass} grid gap-10 p-6 sm:p-10 md:grid-cols-[280px_1fr] md:items-center`}
          >
            {/* Photo */}
            <motion.div
              variants={fadeUp}
              className="relative mx-auto w-full max-w-[280px]"
            >
              <motion.div
                animate={{ opacity: [0.15, 0.3, 0.15] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -inset-6 rounded-[40px] bg-gradient-to-tr from-[#ffc46b] to-[#ff6a3d] blur-3xl"
              />
              <motion.img
                src="/image.png"
                alt="Ephrem Eyob, Graphic Designer"
                loading="lazy"
                whileHover={{ scale: 1.02, filter: "grayscale(0%)" }}
                transition={{ duration: 0.5 }}
                className="relative block aspect-[3/4] w-full rounded-3xl border border-white/[0.08] object-cover object-top grayscale"
              />
            </motion.div>

            {/* Content */}
            <motion.div variants={fadeUp} className="flex flex-col">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#ffa94d]/25 bg-[#ffa94d]/8 px-3.5 py-1.5 text-[11px] font-medium tracking-widest text-[#ffa94d] uppercase"
              >
                <Sparkles size={10} /> About me
              </motion.span>

              <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl">
                I&apos;m a{" "}
                <span className="font-serif italic font-normal text-white/40">
                  graphic
                </span>{" "}
                designer
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-500">
                Passionate about turning simple ideas into powerful visuals.
                With a focus on clean design, modern aesthetics and brand
                storytelling, I help businesses and individuals bring their
                ideas to life.
              </p>

              {/* Stats */}
              <motion.div
                variants={staggerSm}
                className="mt-7 grid max-w-sm grid-cols-3 gap-3"
              >
                {stats.map(({ value, suffix, label }) => (
                  <motion.div
                    key={label}
                    variants={fadeUp}
                    whileHover={{ y: -4, borderColor: "rgba(255,169,77,0.3)" }}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-center transition-colors"
                  >
                    <p className="text-2xl font-bold">
                      <Counter to={value} suffix={suffix} />
                    </p>
                    <p className="mt-1 whitespace-pre-line text-[10px] leading-4 text-neutral-600">
                      {label}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Skills */}
              <motion.div
                variants={staggerSm}
                className="mt-6 flex flex-wrap gap-2"
              >
                {skills.map((s, i) => (
                  <motion.span
                    key={s}
                    variants={fadeIn}
                    whileHover={{
                      scale: 1.06,
                      borderColor: "rgba(255,169,77,0.4)",
                    }}
                    style={{ animationDelay: `${i * 0.1}s` }}
                    className="rounded-full border border-white/[0.07] bg-white/[0.02] px-3.5 py-2 text-[11px] text-white/60 transition"
                  >
                    {s}
                  </motion.span>
                ))}
              </motion.div>

              <motion.a
                href="#contact"
                variants={fadeUp}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className={`${btn} mt-8 self-start`}
              >
                Let&apos;s work together <ArrowRight size={15} />
              </motion.a>
            </motion.div>
          </motion.div>
        </section>

        {/* ── SERVICES ─────────────────────────────────── */}
        <section
          id="services"
          className="relative mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-8"
        >
          <div className="sep absolute inset-x-0 top-0" />
          <SectionTitle
            badge="What I do"
            before="My"
            italic="services"
            text="Design services to help your brand stand out."
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4"
          >
            {services.map(({ title, description, Icon, accent }, i) => (
              <motion.article
                key={title}
                variants={fadeUp}
                whileHover={{ y: -6, boxShadow: "0 24px 60px rgba(0,0,0,0.4)" }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.025] p-6"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent}`}
                />
                <div className="relative z-10">
                  <motion.span
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#ffa94d]/20 bg-[#ffa94d]/10 text-[#ffa94d]"
                  >
                    <Icon size={21} />
                  </motion.span>
                  <h3 className="mt-8 text-base font-semibold">{title}</h3>
                  <p className="mt-2 text-xs leading-5 text-neutral-500">
                    {description}
                  </p>
                  <span className="mt-5 flex items-center gap-1 text-[11px] text-[#ffa94d]/50 transition group-hover:text-[#ffa94d]">
                    Learn more <ArrowUpRight size={11} />
                  </span>
                </div>
                {/* Card number */}
                <span className="pointer-events-none absolute right-4 top-3 font-mono text-6xl font-bold text-white/[0.03]">
                  0{i + 1}
                </span>
              </motion.article>
            ))}
          </motion.div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────── */}
        <section
          id="testimonials"
          className="relative mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-8"
        >
          <div className="sep absolute inset-x-0 top-0" />
          <SectionTitle
            badge="Client feedback"
            before="What clients"
            italic="say"
            text="Words from people I've had the pleasure of working with."
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {displayedT.map((t) => {
              const stars = Math.min(
                5,
                Math.max(0, Math.round(Number(t.rating) || 0)),
              );
              return (
                <motion.article
                  key={t.id}
                  variants={fadeUp}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 20px 60px rgba(255,169,77,0.06)",
                  }}
                  transition={{ type: "spring", stiffness: 280, damping: 20 }}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.025] p-6"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute right-4 top-3 font-serif text-8xl leading-none text-white/[0.03]"
                  >
                    &ldquo;
                  </span>
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{
                          delay: 0.05 * i,
                          type: "spring",
                          stiffness: 400,
                        }}
                        viewport={{ once: true }}
                        className={`text-base ${i < stars ? "text-[#ffa94d]" : "text-white/[0.1]"}`}
                      >
                        <Star
                          size={14}
                          fill={i < stars ? "#ffa94d" : "transparent"}
                          strokeWidth={1}
                        />
                      </motion.span>
                    ))}
                  </div>
                  <p className="relative mt-4 flex-1 text-sm leading-7 text-neutral-400">
                    &ldquo;{t.feedback}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-3 border-t border-white/[0.05] pt-4">
                    <motion.span
                      whileHover={{ scale: 1.1 }}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ffc46b]/30 to-[#ff6a3d]/20 text-sm font-bold text-[#ffa94d]"
                    >
                      {t.client_name.charAt(0).toUpperCase()}
                    </motion.span>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold">
                        {t.client_name}
                      </h3>
                      <p className="truncate text-xs text-neutral-600">
                        {t.project_name}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>

          {testimonialsLoaded && testimonials.length === 0 && (
            <p className="py-12 text-center text-sm text-neutral-600">
              Client feedback will appear here soon.
            </p>
          )}

          {testimonials.length > 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-8 flex justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                aria-expanded={showAllFeedback}
                onClick={() => setShowAllFeedback((p) => !p)}
                className={`${pill} inline-flex items-center gap-2 px-6 py-2.5 text-xs`}
              >
                {showAllFeedback ? "Show less" : "Show more"}
                <motion.span
                  animate={{ rotate: showAllFeedback ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ArrowDown size={14} />
                </motion.span>
              </motion.button>
            </motion.div>
          )}
        </section>

        {/* ── CONTACT ──────────────────────────────────── */}
        <ContactSection />

        {/* ── FEEDBACK FORM ────────────────────────────── */}
        <TestimonialForm />

        {/* ── FOOTER ───────────────────────────────────── */}
        <footer className="relative px-4 pb-8 pt-12 sm:px-8">
          <div className="sep absolute inset-x-0 top-0" />
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
              {/* Left */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={`${glass} flex flex-col justify-between gap-10 p-7`}
              >
                <div>
                  <a
                    href="#home"
                    aria-label="Creative home"
                    className="inline-flex items-center gap-[0.15em]"
                  >
                    <LogoMark className="h-[2em] w-[2em] shrink-0" />
                    <span
                      className={`${brandFont.className} text-lg font-semibold leading-none tracking-[0.08em]`}
                    >
                      <span className="text-white">Epha Creative</span>
                    </span>
                  </a>
                  <p className="mt-4 max-w-xs text-sm leading-6 text-neutral-500">
                    Turning ideas into visuals. Graphic design made to help
                    brands stand out.
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#ffa94d]/20 bg-[#ffa94d]/[0.06] px-3.5 py-2 text-xs text-[#ffa94d]">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ffa94d] opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ffa94d]" />
                    </span>
                    Available for projects
                  </div>
                </div>
                <nav className="flex flex-wrap gap-2">
                  {navigation.map(([label, href]) => (
                    <motion.a
                      key={label}
                      href={href}
                      whileHover={{ scale: 1.05 }}
                      className={`${pill} px-3.5 py-2 text-xs`}
                    >
                      {label}
                    </motion.a>
                  ))}
                </nav>
              </motion.div>

              {/* Right */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={`${glass} p-7`}
              >
                <h3 className="text-lg font-semibold">
                  Let&apos;s{" "}
                  <span className="font-serif italic font-normal text-white/40">
                    connect
                  </span>
                </h3>
                <p className="mt-3 text-sm leading-6 text-neutral-500">
                  Have an idea? Let&apos;s create something meaningful together.
                </p>
                <motion.a
                  href="https://t.me/Ephremeyob"
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className={`${btn} mt-5`}
                >
                  <Send size={15} /> Message on Telegram
                </motion.a>

                <div className="mt-6 flex flex-wrap gap-2">
                  {(
                    [
                      ["Telegram", "https://t.me/Ephremeyob", Send],
                      ["Email", "mailto:Eeyob1997@gmail.com", Mail],
                      ["Phone", "tel:+251906492021", Phone],
                      [
                        "Instagram",
                        "https://www.instagram.com/epha_creative2026/",
                        Instagram,
                      ],
                      [
                        "GitHub",
                        "https://github.com/eeyob1997-ux/Ephrem-eyob",
                        Github,
                      ],
                    ] as const
                  ).map(([label, href, Icon]) => (
                    <motion.a
                      key={label}
                      href={href}
                      aria-label={label}
                      {...(String(href).startsWith("http")
                        ? { target: "_blank", rel: "noreferrer" }
                        : {})}
                      whileHover={{ scale: 1.15, y: -2 }}
                      whileTap={{ scale: 0.92 }}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.02] text-white/50 transition hover:border-[#ffa94d]/50 hover:bg-[#ffa94d]/10 hover:text-[#ffa94d]"
                    >
                      <Icon size={16} />
                    </motion.a>
                  ))}
                </div>

                <div className="mt-5 space-y-1.5 text-xs text-neutral-600">
                  <a
                    href="mailto:Eeyob1997@gmail.com"
                    className="block break-all transition hover:text-[#ffa94d]"
                  >
                    Eeyob1997@gmail.com
                  </a>
                  <a
                    href="tel:+251906492021"
                    className="block transition hover:text-[#ffa94d]"
                  >
                    +251 906 492 021
                  </a>
                  <a
                    href="tel:+251913630358"
                    className="block transition hover:text-[#ffa94d]"
                  >
                    +251 913 630 358
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Bottom bar */}
            <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-white/[0.04] pt-6 text-xs text-neutral-700 md:flex-row">
              <p>© {new Date().getFullYear()} Creative. All rights reserved.</p>
              <motion.a
                href="#home"
                whileHover={{ y: -2, color: "#ffa94d" }}
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-2 transition"
              >
                Back to top <ArrowDown className="rotate-180" size={13} />
              </motion.a>
              <p>
                Developed by{" "}
                <span className="font-semibold bg-gradient-to-r from-[#ffc46b] to-[#ff6a3d] bg-clip-text text-transparent">
                  Ephrem Eyob
                </span>
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
