import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Search,
  Play,
  Bell,
  Settings,
  GitBranch,
  User,
  MessageSquare,
} from "lucide-react";

interface TopbarProps {
  isAiPanelOpen: boolean;
  onToggleAiPanel: () => void;
  onRun: () => void;
  branch?: string | null;
  collaborators: number;
}

export default function Topbar({
  isAiPanelOpen,
  onToggleAiPanel,
  onRun,
  branch,
  collaborators,
}: TopbarProps) {
  return (
    <motion.header
      initial={{ y: -25, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="sticky top-0 z-50 h-16 border-b border-white/10 bg-[#07070B]/80 backdrop-blur-xl"
    >
      <div className="flex h-full items-center justify-between px-6">

        {/* LEFT */}
        <div className="flex items-center gap-8">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <motion.div
              whileHover={{
                rotate: 10,
                scale: 1.08,
              }}
              transition={{
                type: "spring",
                stiffness: 250,
              }}
              className="
                flex h-10 w-10 items-center justify-center
                rounded-xl
                bg-gradient-to-br
                from-violet-500
                to-fuchsia-600
                shadow-lg
                shadow-violet-600/40
              "
            >
              <Sparkles className="h-5 w-5 text-white" />
            </motion.div>

            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">
                Codexa
              </h1>

              <p className="-mt-1 text-[10px] uppercase tracking-[0.35em] text-zinc-500">
                AI IDE
              </p>
            </div>
          </Link>

          {/* Branch */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="
              hidden lg:flex
              items-center gap-2
              rounded-full
              border border-violet-500/20
              bg-violet-500/10
              px-3 py-1
              text-xs
              text-violet-300
            "
          >
            <GitBranch size={14} />
            {branch ?? "No Git"}
          </motion.div>
        </div>

        {/* CENTER */}
        <motion.div
          whileHover={{ scale: 1.015 }}
          className="
            hidden lg:flex
            w-[420px]
            items-center gap-3
            rounded-xl
            border border-white/10
            bg-[#0F0F15]
            px-4 py-2
            transition-all
            hover:border-violet-500/30
          "
        >
          <Search size={18} className="text-zinc-500" />

          <input
            placeholder="Search files..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500"
          />

          <kbd className="rounded bg-zinc-800 px-2 py-1 text-[10px] text-zinc-400">
            Ctrl K
          </kbd>
        </motion.div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          <motion.button
            type="button"
            onClick={onToggleAiPanel}
            aria-label={isAiPanelOpen ? "Close AI chat" : "Open AI chat"}
            title={isAiPanelOpen ? "Close AI chat" : "Open AI chat"}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className={`rounded-xl border p-2 transition-all ${
              isAiPanelOpen
                ? "border-violet-500/50 bg-violet-500/15 text-violet-200"
                : "border-white/10 bg-[#111117] text-zinc-300 hover:border-violet-500/40 hover:bg-violet-500/10"
            }`}
          >
            <MessageSquare size={18} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="
              rounded-xl
              border border-white/10
              bg-[#111117]
              p-2
              transition-all
              hover:border-violet-500/40
              hover:bg-violet-500/10
            "
          >
            <Bell size={18} />
          </motion.button>

          {collaborators > 1 && <span title={`${collaborators} collaborators online`} className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">{collaborators} online</span>}

          <Link to="/settings" className="rounded-xl">
            <motion.span
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex
              rounded-xl
              border border-white/10
              bg-[#111117]
              p-2
              transition-all
              hover:border-violet-500/40
              hover:bg-violet-500/10
              "
            >
              <Settings size={18} />
            </motion.span>
          </Link>

          <motion.button
            type="button"
            onClick={onRun}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 35px rgba(139,92,246,.45)",
            }}
            whileTap={{ scale: 0.96 }}
            className="
              flex items-center gap-2
              rounded-xl
              bg-gradient-to-r
              from-violet-600
              to-fuchsia-600
              px-5 py-2
              font-medium
              text-white
            "
          >
            <Play size={16} />
            Run
          </motion.button>

          {/* Profile */}
          <motion.button
            whileHover={{
              scale: 1.08,
              boxShadow: "0 0 25px rgba(139,92,246,.35)",
            }}
            whileTap={{ scale: 0.95 }}
            className="
              flex h-10 w-10 items-center justify-center
              rounded-full
              border border-white/10
              bg-[#111117]
              transition-all
              hover:border-violet-500/50
              hover:bg-violet-500/10
            "
          >
            <User
              size={18}
              className="text-zinc-300 transition-colors hover:text-violet-300"
            />
          </motion.button>

        </div>
      </div>
    </motion.header>
  );
}
