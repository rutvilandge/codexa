import {
  Brain,
  Code2,
  Terminal,
  Rocket,
  FolderGit2,
  ShieldCheck,
} from "lucide-react";

const cards = [
  {
    icon: Brain,
    title: "AI Software Engineer",
    desc: "Generate code, refactor projects, debug applications and solve complex development problems using powerful AI agents.",
  },
  {
    icon: Code2,
    title: "Code Generation",
    desc: "Create production-ready React components, APIs and backend logic instantly.",
  },
  {
    icon: Terminal,
    title: "Smart Terminal",
    desc: "Execute commands, install packages and automate workflows without leaving Codexa.",
  },
  {
    icon: FolderGit2,
    title: "Project Management",
    desc: "Manage files, organize projects and collaborate using one AI workspace.",
  },
  {
    icon: Rocket,
    title: "One-Click Deployment",
    desc: "Build and deploy applications with an optimized cloud workflow.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Workspace",
    desc: "Authentication, protected routes and enterprise-grade security built in.",
  },
];

export default function WhyCodexa() {
  return (
    <section id="why" className="bg-[#07070B] py-32">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="mb-20 text-center">

          <span className="rounded-full border border-violet-500/30 px-5 py-2 text-sm text-violet-300">
            Why Codexa?
          </span>

          <h2 className="mt-6 text-5xl font-black">
            Everything Developers
            <br />
            Need in One Place
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            Stop switching between dozens of tools. Codexa combines AI,
            coding, debugging, deployment and project management into one
            intelligent workspace.
          </p>

        </div>

        {/* Equal Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {cards.map((card) => (
            <div
              key={card.title}
              className="flex min-h-[320px] flex-col rounded-3xl border border-white/10 bg-gradient-to-b from-[#16161F] to-[#0D0D12] p-8 transition hover:-translate-y-1 hover:border-violet-500/40"
            >

              {/* Icon */}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10">
                <card.icon size={28} className="text-violet-400" />
              </div>

              {/* Content */}
              <h3 className="mt-8 text-2xl font-bold leading-tight">
                {card.title}
              </h3>

              <p className="mt-5 text-base leading-7 text-zinc-400">
                {card.desc}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}