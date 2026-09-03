import { ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export default function CTA() {
  return (
    <section className="relative overflow-hidden py-32">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-[150px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="rounded-[40px] border border-violet-500/20 bg-gradient-to-br from-violet-900/40 via-[#111118] to-[#09090f] p-16 text-center shadow-2xl">
          <span className="rounded-full border border-violet-500/30 px-5 py-2 text-sm text-violet-300">
            Ready to Build?
          </span>

          <h2 className="mt-8 text-5xl font-black leading-tight">
            Build Smarter.
            <br />
            Ship Faster.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            Experience an AI-powered software engineering workspace that
            helps you plan, generate, debug and manage projects from one
            place.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-5">
            <button className="flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-4 font-semibold text-white transition hover:bg-violet-500">
              Launch Workspace
              <ArrowRight size={18} />
            </button>

            <a
              href="https://github.com/rutvilandge/codexa"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border border-white/10 px-8 py-4 font-semibold text-white transition hover:border-violet-500 hover:bg-white/5"
            >
              <FaGithub className="h-[18px] w-[18px]" />
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}