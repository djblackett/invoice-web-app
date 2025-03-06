import { motion } from "framer-motion";

function BreathingText({ text }: { text: string }) {
  return (
    <motion.h1
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{ textAlign: "center" }}
    >
      {text}
    </motion.h1>
  );
}

export default BreathingText;
