import { motion } from "framer-motion";

export default function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">

      {/* Purple Blob */}
      <motion.div
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 50, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[-180px] top-[-150px] h-[520px] w-[520px] rounded-full bg-violet-600/25 blur-[140px]"
      />

      {/* Blue Blob */}
      <motion.div
        animate={{
          x: [0, -70, 50, 0],
          y: [0, 60, -50, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[-150px] top-[120px] h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[140px]"
      />

      {/* Pink Blob */}
      <motion.div
        animate={{
          x: [0, 60, -60, 0],
          y: [0, -40, 60, 0],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-220px] left-1/2 h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-fuchsia-500/15 blur-[170px]"
      />
    </div>
  );
}