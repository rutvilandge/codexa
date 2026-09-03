import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#07070B]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-600/40">
            <Sparkles className="h-5 w-5 text-white" />
          </div>

          <span className="text-2xl font-black tracking-tight text-white">
            Codexa
          </span>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-8 text-sm text-gray-300 md:flex">
          <a href="#features" className="transition hover:text-violet-400">
            Features
          </a>

          <a href="#workflow" className="transition hover:text-violet-400">
            Workflow
          </a>

          <a href="#roadmap" className="transition hover:text-violet-400">
            Roadmap
          </a>

          <a href="#faq" className="transition hover:text-violet-400">
            FAQ
          </a>
        </div>

        {/* Launch Workspace */}
        <Link
          to="/login"
          className="rounded-xl bg-violet-600 px-5 py-2 font-medium text-white transition hover:bg-violet-500"
        >
          Launch Workspace
        </Link>

      </div>
    </nav>
  );
}