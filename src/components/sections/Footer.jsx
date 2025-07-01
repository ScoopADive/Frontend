import { motion } from "framer-motion";

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-gray-100 py-6 text-center text-sm text-gray-500"
    >
      © 2025 ScoopADive. All rights reserved.
    </motion.footer>
  );
}

export default Footer;

