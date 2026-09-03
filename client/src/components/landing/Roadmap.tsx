import {
  CheckCircle2,
  Clock3,
  Circle,
  ArrowRight,
} from "lucide-react";

const roadmap = [
  {
    status: "available",
    title: "AI Workspace",
    desc: "Unified interface for coding, AI assistance and project management.",
  },
  {
    status: "available",
    title: "Smart Code Generation",
    desc: "Generate production-ready React components, APIs and documentation instantly.",
  },
  {
    status: "progress",
    title: "Integrated Monaco Editor",
    desc: "Professional editor with syntax highlighting, IntelliSense and AI suggestions.",
  },
  {
    status: "progress",
    title: "Multi-Agent AI",
    desc: "Multiple specialized AI agents collaborating on planning, coding, reviewing and debugging.",
  },
  {
    status: "planned",
    title: "Plugin Marketplace",
    desc: "Install community-built plugins, integrations and custom extensions.",
  },
  {
    status: "planned",
    title: "One-Click Cloud Deployment",
    desc: "Deploy projects directly from Codexa to modern cloud providers.",
  },
];

export default function Roadmap() {
  return (
    <section
      id="roadmap"
      className="py-32 bg-[#08080d]"
    >
      <div className="mx-auto max-w-6xl px-6">

        <div className="text-center">

          <span className="rounded-full border border-violet-500/30 px-5 py-2 text-sm text-violet-300">
            Product Vision
          </span>

          <h2 className="mt-6 text-5xl font-black">
            Building the Future of Software Development
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
            Every release moves Codexa closer to becoming the complete
            AI-powered software engineering workspace.
          </p>

        </div>

        <div className="mt-20 space-y-6">

          {roadmap.map((item) => (
            <div
              key={item.title}
              className="group flex items-start gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition-all duration-300 hover:border-violet-500 hover:bg-white/[0.05]"
            >

              <div className="mt-1 flex-shrink-0">

                {item.status === "available" && (
                  <CheckCircle2 className="h-8 w-8 text-green-400" />
                )}

                {item.status === "progress" && (
                  <Clock3 className="h-8 w-8 text-yellow-400" />
                )}

                {item.status === "planned" && (
                  <Circle className="h-8 w-8 text-violet-400" />
                )}

              </div>

              <div className="flex-1">

                <div className="flex items-center justify-between">

                  <h3 className="text-2xl font-bold text-white">
                    {item.title}
                  </h3>

                  <ArrowRight className="h-5 w-5 text-zinc-600 transition-all group-hover:translate-x-1 group-hover:text-violet-400" />

                </div>

                <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-400">
                  {item.desc}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}