import { motion } from "framer-motion";
import { Sparkles, Code2 } from "lucide-react";

export default function EmptyEditor() {
  return (
    <div className="flex h-full items-center justify-center bg-[#0E0E11]">

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.4,
        }}
        className="text-center"
      >

        <motion.div
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
          }}
          className="
            mx-auto mb-8
            flex h-24 w-24
            items-center justify-center
            rounded-3xl
            bg-gradient-to-br
            from-violet-600
            to-fuchsia-600
            shadow-2xl
            shadow-violet-600/30
          "
        >
          <Sparkles size={42} className="text-white" />
        </motion.div>

        <h1 className="mb-3 text-3xl font-bold text-white">
          Welcome to Codexa
        </h1>

        <p className="mx-auto mb-8 max-w-md text-zinc-400">
          Open a file from the Explorer or ask Codexa AI to generate one.
        </p>

        <div
          className="
            mx-auto flex w-fit items-center gap-3
            rounded-xl
            border border-violet-500/20
            bg-violet-500/10
            px-5 py-3
            text-violet-300
          "
        >
          <Code2 size={18} />

          <span className="text-sm font-medium">
            Your intelligent coding workspace is ready.
          </span>
        </div>

      </motion.div>

    </div>
  );
}