import { motion } from "framer-motion";

export default function AmbientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">

      <motion.div
        animate={{
          x: [0, 80, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
        absolute
        -left-40
        -top-40
        h-[420px]
        w-[420px]
        rounded-full
        bg-violet-600/15
        blur-[140px]
        "
      />

      <motion.div
        animate={{
          x: [0, -60, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
        absolute
        right-0
        top-40
        h-[380px]
        w-[380px]
        rounded-full
        bg-blue-500/10
        blur-[140px]
        "
      />

    </div>
  );
}
