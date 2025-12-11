// TestimonialSection.jsx
import { motion } from "framer-motion";

function TestimonialSection() {
  const audiences = [
    { title: "High-Value Travelers", description: "MZ generation spends more on unique adventures than on material goods, seeking memorable dive experiences.", tags: ["Premium Spending", "Experience-First"] },
    { title: "Community-Driven", description: "Connect with dive buddies, share experiences, and grow together in a supportive global community.", tags: ["Social Connection", "Buddy Matching"] },
    { title: "Visual-First Mindset", description: "Share-worthy moments drive decisions. Transform your dive logs into compelling visual stories.", tags: ["Instagram Ready", "Photo Sharing"] },
    { title: "Seamless Entry", description: "No complex logbooks or steep learning curves. Start sharing underwater adventures in seconds.", tags: ["Quick Start", "Intuitive Design"] },
  ];

  return (
    <section className="border-t border-border bg-secondary py-16 px-4 sm:px-6 md:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center justify-center rounded-full border border-border bg-secondary px-4 py-1 text-xs font-medium text-muted-foreground">
            Target Audience
          </div>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Built for the Next Generation
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            MZ generation prioritizes experiences over possessions, spending more on unique adventures than on material goods.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {audiences.map((a, idx) => (
            <motion.div
              key={a.title}
              className="rounded-3xl border border-border bg-card p-7 text-left shadow-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-base font-semibold text-foreground">{a.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                {a.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-card border border-border px-3 py-1">{tag}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialSection;
