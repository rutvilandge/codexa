import {
  Brain,
  Code2,
  Rocket,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Agents",
    desc: "Plan, code and debug with intelligent assistants.",
  },
  {
    icon: Code2,
    title: "Code Generation",
    desc: "Generate production-ready applications instantly.",
  },
  {
    icon: Rocket,
    title: "Deploy Faster",
    desc: "Ship software from one integrated workspace.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Workspace",
    desc: "Authentication and modern security built in.",
  },
];

export default function AuthShowcase() {
  return (
    <div className="hidden lg:flex flex-col justify-center h-full px-16">

      <div>

        <span className="inline-flex rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
          ✨ Welcome to Codexa
        </span>

        <h1 className="mt-8 text-6xl font-black leading-tight text-white">

          Build Software

          <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">

            Smarter with AI

          </span>

        </h1>

        <p className="mt-8 max-w-xl text-lg leading-8 text-zinc-400">

          The AI-powered software engineering workspace that helps
          developers plan, generate, debug and ship modern applications
          from one intelligent platform.

        </p>

      </div>

      <div className="mt-16 grid gap-6">

        {features.map((item) => (
          <div
            key={item.title}
            className="flex gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
              <item.icon className="h-6 w-6 text-violet-400" />
            </div>

            <div>
              <h3 className="font-semibold text-white">
                {item.title}
              </h3>

              <p className="mt-1 text-sm text-zinc-400">
                {item.desc}
              </p>
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}