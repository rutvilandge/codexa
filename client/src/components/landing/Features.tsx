import {
  Brain,
  Code2,
  Terminal,
  FileText,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Coding Assistant",
    description:
      "Generate, refactor and understand code with an intelligent AI assistant inside your workspace.",
  },
  {
    icon: Code2,
    title: "Project Generation",
    description:
      "Scaffold complete applications with modern architectures and best practices.",
  },
  {
    icon: Terminal,
    title: "Smart Terminal",
    description:
      "Execute commands, debug projects and automate development workflows effortlessly.",
  },
  {
    icon: FileText,
    title: "Documentation",
    description:
      "Generate READMEs, API docs and technical documentation automatically.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-28 bg-[#07070B]"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">

          <span className="rounded-full border border-violet-500/40 px-5 py-2 text-violet-300 text-sm">
            Everything you need
          </span>

          <h2 className="mt-6 text-5xl font-black">
            Build Faster.
            <br />
            Think Bigger.
          </h2>

          <p className="mt-5 text-zinc-400 max-w-2xl mx-auto">
            Codexa combines AI, development tools and automation into
            one seamless workspace built for modern software teams.
          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-20">

          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:border-violet-500 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-14 h-14 rounded-2xl bg-violet-600/20 flex items-center justify-center">
                <feature.icon className="text-violet-400 w-7 h-7" />
              </div>

              <h3 className="mt-6 text-2xl font-bold">
                {feature.title}
              </h3>

              <p className="mt-4 text-zinc-400 leading-8">
                {feature.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}