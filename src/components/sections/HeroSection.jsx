// HeroSection.jsx
import { motion } from "framer-motion";
import { Heart, Zap, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="flex min-h-screen flex-col items-center justify-center bg-secondary px-4 text-center pt-24 pb-20"
    >
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="mx-auto max-w-3xl"
      >
        <div className="inline-flex items-center justify-center rounded-full border border-border bg-card px-4 py-1 text-xs font-medium text-muted-foreground">
          Scoopadive
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Every dive, one scoop
          <br className="hidden sm:block" />
          of your story.
        </h1>

        <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Every dive tells a story. We help you capture, share, and relive those
          unforgettable underwater moments with simplicity and joy.
        </p>
      </motion.div>

      {/* Cards */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-14 grid w-full max-w-5xl gap-6 md:grid-cols-3"
      >
        <div className="rounded-3xl border border-border bg-card p-7 text-left shadow-sm">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Heart className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Friendly Support</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Like your trusted dive buddy, we celebrate every achievement from first descents to milestone dives.
          </p>
          <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
            <li>Personalized milestones</li>
            <li>Progress celebration</li>
            <li>Community support</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-border bg-card p-7 text-left shadow-sm">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Crystal Clear Guide</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Diving made simple with plain language explanations that everyone can understand and follow.
          </p>
          <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
            <li>No jargon needed</li>
            <li>Step-by-step help</li>
            <li>Easy navigation</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-border bg-card p-7 text-left shadow-sm">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <BarChart3 className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Smart Analytics</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Turn your dive logs into actionable insights with data-driven recommendations for growth.
          </p>
          <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
            <li>Performance tracking</li>
            <li>Pattern recognition</li>
            <li>Tailored suggestions</li>
          </ul>
        </div>
      </motion.div>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
      >
        <button
          onClick={() => navigate("/signin")}
          className="inline-flex items-center rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-md hover:bg-primary/90 transition-colors"
        >
          Get Started
        </button>

        <button
          onClick={() => navigate("/signup")}
          className="inline-flex items-center rounded-full border border-border bg-secondary px-8 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors"
        >
          Watch Demo
        </button>
      </motion.div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground"
      >
        <span className="inline-flex items-center rounded-full bg-card border border-border px-4 py-2 shadow-sm">
          50+ Dive Sites
        </span>
        <span className="inline-flex items-center rounded-full bg-card border border-border px-4 py-2 shadow-sm">
          Global Community
        </span>
        <span className="inline-flex items-center rounded-full bg-card border border-border px-4 py-2 shadow-sm">
          Share Moments
        </span>
      </motion.div>
    </motion.section>
  );
}

export default HeroSection;
