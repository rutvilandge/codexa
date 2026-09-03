import {
  Sparkles,
  Mail,
  ArrowUpRight,
  Heart,
} from "lucide-react";

import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#05050A]">
      <div className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-12 md:grid-cols-4">

          {/* Brand */}
          <div className="md:col-span-2">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-600/40">
                <Sparkles className="h-6 w-6 text-white" />
              </div>

              <span className="text-3xl font-black">
                Codexa
              </span>

            </div>

            <p className="mt-6 max-w-md leading-8 text-zinc-400">
              An AI-powered software engineering workspace designed to help
              developers plan, generate, debug and ship software faster from
              one intelligent platform.
            </p>

          </div>

          {/* Product */}

          <div>

            <h3 className="mb-5 text-lg font-semibold">
              Product
            </h3>

            <div className="space-y-3 text-zinc-400">

              <a href="#features" className="block hover:text-violet-400">
                Features
              </a>

              <a href="#workflow" className="block hover:text-violet-400">
                Workflow
              </a>

              <a href="#roadmap" className="block hover:text-violet-400">
                Roadmap
              </a>

              <a href="#faq" className="block hover:text-violet-400">
                FAQ
              </a>

            </div>

          </div>

          {/* Contact */}

          <div>

            <h3 className="mb-5 text-lg font-semibold">
              Connect
            </h3>

            <div className="space-y-4">

              <a
                href="mailto:rutvilandge@gmail.com"
                className="flex items-center gap-3 text-zinc-400 transition hover:text-violet-400"
              >
                <Mail size={18} />
                rutvilandge@gmail.com
              </a>

              <a
                href="https://github.com/rutvilandge"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-zinc-400 transition hover:text-violet-400"
              >
                <FaGithub className="h-[18px] w-[18px]" />
                GitHub
                <ArrowUpRight size={16} />
              </a>

              <a
                href="https://www.linkedin.com/in/rutvi-landge-9988413b0"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-zinc-400 transition hover:text-violet-400"
              >
                <FaLinkedin className="h-[18px] w-[18px]" />
                LinkedIn
                <ArrowUpRight size={16} />
              </a>

            </div>

          </div>

        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">

          <p className="text-zinc-500">
            © {new Date().getFullYear()} Codexa. All rights reserved.
          </p>

          <p className="flex items-center gap-2 text-zinc-500">
            Built with
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            by
            <span className="font-semibold text-white">
              Rutvi Landge
            </span>
          </p>

        </div>

      </div>
    </footer>
  );
}