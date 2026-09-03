import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import AuroraBackground from "./AuroraBackground";
import GridBackground from "./GridBackground";
import MouseGlow from "./MouseGlow";
import FloatingChips from "./FloatingChips";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-screen items-center overflow-hidden bg-[#07070B]">

      <GridBackground />
      <AuroraBackground />
      <MouseGlow />
      <FloatingChips />

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,transparent_25%,#07070B_90%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >

          <div className="inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-sm text-violet-300 backdrop-blur-xl">
            🚀 AI Software Engineering Platform
          </div>

          <h1 className="mt-8 text-6xl font-black leading-tight md:text-7xl">
            Build Software

            <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Faster with AI
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-zinc-400">
            Generate projects, write production-ready code,
            debug instantly and manage your complete software
            development workflow from one intelligent workspace.
          </p>

          {/* Launch Workspace */}
          <div className="mt-12 flex justify-center">
            <Link
              to="/login"
              className="group flex items-center gap-3 rounded-xl bg-violet-600 px-8 py-4 font-semibold text-white transition hover:bg-violet-500"
            >
              Launch Workspace

              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </Link>
          </div>

        </motion.div>

        {/* Workspace Preview */}
        <motion.div
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9 }}
          className="mx-auto mt-24 overflow-hidden rounded-3xl border border-white/10 bg-[#0D1117] shadow-[0_0_80px_rgba(139,92,246,.18)]"
        >

          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">

            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>

            <span className="text-sm text-zinc-400">
              Codexa Workspace
            </span>

          </div>

          <div className="grid lg:grid-cols-12">

            {/* Explorer */}
            <div className="hidden border-r border-white/10 bg-[#09090f] lg:col-span-2 lg:block">
              <div className="p-5">

                <p className="mb-4 text-sm font-semibold text-white">
                  Explorer
                </p>

                <div className="space-y-3 text-sm text-zinc-400">
                  <div>📁 app</div>
                  <div>📁 components</div>
                  <div>📁 lib</div>
                  <div>📁 prisma</div>
                  <div>📄 page.tsx</div>
                  <div>📄 layout.tsx</div>
                  <div>⚙ package.json</div>
                </div>

              </div>
            </div>

            {/* Editor */}
            <div className="border-r border-white/10 lg:col-span-7">

              <pre className="overflow-x-auto p-8 text-left text-sm leading-7 text-zinc-300">
{`import { Codexa } from "@codexa/core";

const ai = new Codexa();

await ai.generate({
  prompt: "Build an AI SaaS dashboard"
});

await ai.createAPI();
await ai.setupDatabase();
await ai.run();

console.log("🚀 Project Ready");`}
              </pre>

            </div>

            {/* AI Assistant */}
            <div className="bg-[#09090f] lg:col-span-3">

              <div className="p-6">

                <h3 className="font-semibold text-white">
                  🤖 AI Assistant
                </h3>

                <div className="mt-6 space-y-4">

                  <div className="rounded-xl bg-violet-500/10 p-3 text-sm text-violet-300">
                    ✔ Authentication generated
                  </div>

                  <div className="rounded-xl bg-white/5 p-3 text-sm text-zinc-300">
                    ✔ Prisma schema created
                  </div>

                  <div className="rounded-xl bg-white/5 p-3 text-sm text-zinc-300">
                    ✔ API routes generated
                  </div>

                  <div className="rounded-xl bg-white/5 p-3 text-sm text-zinc-300">
                    ✔ Dashboard completed
                  </div>

                  <div className="rounded-xl bg-green-500/10 p-3 text-sm text-green-300">
                    🚀 Ready for deployment
                  </div>

                </div>

              </div>

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}