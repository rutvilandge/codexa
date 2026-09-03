import { motion } from "framer-motion";

const chips = [
  {
    text: "🤖 AI Agent",
    top: "12%",
    left: "8%",
    delay: 0,
  },
  {
    text: "⚛ React 19",
    top: "18%",
    right: "10%",
    delay: 0.4,
  },
  {
    text: "🟣 TypeScript",
    top: "55%",
    left: "5%",
    delay: 0.8,
  },
  {
    text: "🐳 Docker",
    top: "70%",
    right: "8%",
    delay: 1.2,
  },
  {
    text: "⚡ Groq",
    top: "82%",
    left: "25%",
    delay: 1.6,
  },
  {
    text: "🧠 RAG",
    top: "35%",
    right: "22%",
    delay: 2,
  },
];

export default function FloatingChips() {
  return (
    <>
      {chips.map((chip) => (
        <motion.div
          key={chip.text}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            y: [0, -12, 0],
          }}
          transition={{
            opacity: {
              duration: 0.8,
              delay: chip.delay,
            },
            y: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: chip.delay,
            },
          }}
          className="absolute hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur-xl lg:block"
          style={{
            top: chip.top,
            left: chip.left,
            right: chip.right,
          }}
        >
          {chip.text}
        </motion.div>
      ))}
    </>
  );
}