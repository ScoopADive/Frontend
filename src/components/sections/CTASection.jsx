// CTASection.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function CTASection() {
  return (
    <motion.section
      className="border-t border-border bg-background py-20 px-4 text-center sm:px-6 md:py-24 lg:px-8"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="mx-auto max-w-3xl">
        <div className="inline-flex items-center justify-center rounded-full border border-border bg-secondary px-4 py-1 text-xs font-medium text-muted-foreground">
          Join the Movement
        </div>
        <h2 className="mt-6 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Ready to Dive In?
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Start logging your dives today and connect with passionate divers from around the world.
        </p>

        <div className="mt-10 flex justify-center">
          <Link
            to="/signup"
            className="inline-flex items-center rounded-full bg-primary px-10 py-3.5 text-sm font-medium text-primary-foreground shadow-md hover:bg-primary/90 transition-colors"
          >
            Start Your Journey
            <span className="ml-2 text-base">→</span>
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground sm:text-sm">
          <span>Free to start</span>
          <span>No credit card required</span>
          <span>Cancel anytime</span>
        </div>
      </div>
    </motion.section>
  );
}

export default CTASection;
