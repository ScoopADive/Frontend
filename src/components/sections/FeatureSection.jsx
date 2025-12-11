// FeatureSection.jsx
import { motion } from "framer-motion";

function FeatureSection() {
  const coreFeatures = [
    {
      title: "Simple Logging",
      description:
        "Log your dive in under 60 seconds. Location, depth, time, conditions – that is all you need.",
      points: ["One-minute quick log", "Essential data only", "Mobile optimized"],
    },
    {
      title: "Visual Stories",
      description:
        "Upload photos, share underwater moments, and inspire the global diving community.",
      points: ["High-quality uploads", "Social sharing", "Photo galleries"],
    },
    {
      title: "Buddy Matching",
      description:
        "Find dive partners, join groups, and build lasting connections worldwide.",
      points: ["Partner search", "Group diving", "Community events"],
    },
  ];

  return (
    <section className="border-t border-border bg-background py-16 px-4 sm:px-6 md:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Market Opportunity */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center justify-center rounded-full border border-border bg-card px-4 py-1 text-xs font-medium text-muted-foreground">
            Market Opportunity
          </div>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            The Diving Industry is Booming
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Join the fastest-growing water sports market with unprecedented opportunities.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              value: "$8.2B",
              label: "Global market size by 2033",
              sub: "6–8% annual growth rate",
            },
            {
              value: "7.2%",
              label: "Asia-Pacific growth rate",
              sub: "Fastest growing region globally",
            },
            {
              value: "$12.6T",
              label: "Gen Z spending by 2030",
              sub: "5x increase from 2024",
            },
          ].map((stat, idx) => (
            <motion.div
              key={stat.value}
              className="rounded-3xl border border-border bg-card p-7 text-left shadow-sm"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl font-semibold text-foreground">{stat.value}</div>
              <p className="mt-2 text-sm font-medium text-foreground">{stat.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {[
            {
              title: "Premium Experience Market",
              desc: "59% of Gen Z willing to splurge on experience-based spending, creating a premium market opportunity.",
            },
            {
              title: "Social-First Generation",
              desc: "85% of travelers use social media to plan trips, demanding visual-first diving experiences.",
            },
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              className="rounded-3xl border border-border bg-card p-7 text-left shadow-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Core Features */}
        <div className="mt-20 border-t border-border pt-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center justify-center rounded-full border border-border bg-card px-4 py-1 text-xs font-medium text-muted-foreground">
              Core Features
            </div>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Everything You Need, Nothing You Don&apos;t
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Traditional dive apps are cluttered with unused features. We focus exclusively
              on what matters.
            </p>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {coreFeatures.map((f, idx) => (
              <motion.div
                key={f.title}
                className="rounded-3xl border border-border bg-card p-7 text-left shadow-sm"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
                <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                  {f.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;
