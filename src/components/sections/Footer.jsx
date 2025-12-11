import { motion } from "framer-motion";

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 sm:text-sm"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-slate-700">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            ≋
          </div>
          <span className="text-sm font-semibold">Scoopadive</span>
        </div>
        <p>© 2025 Scoopadive. All rights reserved.</p>
      </div>
    </motion.footer>
  );
}

export default Footer;
