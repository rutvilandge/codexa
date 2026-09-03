import { motion } from "framer-motion";

export default function GridBackground() {
  return (
    <motion.div
      animate={{
        backgroundPosition: ["0px 0px", "80px 80px"],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "linear",
      }}
      className="absolute inset-0 -z-20 opacity-30"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px",
      }}
    />
  );
}