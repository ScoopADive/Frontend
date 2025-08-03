import { motion } from "framer-motion";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-white text-white text-center px-4"
    >
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-5xl font-extrabold mb-6"
      >
        ScoopADive
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-xl mb-10"
      >
        나만의 다이빙 로그를 기록하고 공유해보세요
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="flex justify-center gap-4 w-full max-w-md"
      >
        <Button text="Sign In" onClick={() => navigate("/signin")} />
        <Button text="Sign Up" onClick={() => navigate("/signup")} />
      </motion.div>
    </motion.section>
  );
}

export default HeroSection;
