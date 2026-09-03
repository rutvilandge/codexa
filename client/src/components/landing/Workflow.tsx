import {
  Lightbulb,
  WandSparkles,
  Code2,
  Rocket,
} from "lucide-react";

const steps = [
  {
    icon: Lightbulb,
    title: "Describe Your Idea",
    desc: "Simply tell Codexa what you want to build using natural language.",
  },
  {
    icon: WandSparkles,
    title: "AI Plans Everything",
    desc: "Architecture, folders, APIs and implementation are planned automatically.",
  },
  {
    icon: Code2,
    title: "Generate & Edit",
    desc: "Generate production-ready code, edit it, debug it and iterate instantly.",
  },
  {
    icon: Rocket,
    title: "Build & Deploy",
    desc: "Run, test and deploy your project without leaving your workspace.",
  },
];

export default function Workflow() {
  return (
    <section
      id="workflow"
      className="py-32 bg-[#08080d]"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">

          <span className="px-5 py-2 rounded-full border border-violet-500/30 text-violet-300 text-sm">
            Workflow
          </span>

          <h2 className="mt-6 text-5xl font-black">
            From Prompt
            <br />
            to Production
          </h2>

          <p className="mt-5 text-zinc-400 max-w-2xl mx-auto">
            One intelligent workflow. No switching tools. No repetitive setup.
          </p>

        </div>

        <div className="relative mt-24">

          <div className="absolute left-0 right-0 top-12 h-[2px] bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400 hidden lg:block" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:border-violet-500 transition duration-300 hover:-translate-y-2"
              >
                <div className="w-16 h-16 rounded-2xl bg-violet-600/20 flex items-center justify-center mb-6">
                  <step.icon className="w-8 h-8 text-violet-400" />
                </div>

                <div className="absolute top-6 right-6 text-5xl font-black text-white/5">
                  0{index + 1}
                </div>

                <h3 className="text-xl font-bold">
                  {step.title}
                </h3>

                <p className="mt-4 text-zinc-400 leading-7">
                  {step.desc}
                </p>
              </div>
            ))}

          </div>

        </div>
      </div>
    </section>
  );
}