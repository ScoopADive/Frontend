import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function CTASection() {
  return (
    <motion.section
      className="bg-white py-20 text-center px-4"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-4">지금 바로 시작해보세요!</h2>
      <p className="text-gray-600 mb-8">
        나만의 다이빙 로그를 기록하고, 친구와 공유해보세요.
      </p>
    </motion.section>
  );
}

export default CTASection;
