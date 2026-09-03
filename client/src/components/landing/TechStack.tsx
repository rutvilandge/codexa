import {
  Brain,
  Code2,
  Database,
  Terminal,
  Cpu,
  Globe,
  Sparkles,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

const tech = [
  { icon: Brain, name: "AI Agents" },
  { icon: Code2, name: "React" },
  { icon: Database, name: "PostgreSQL" },
  { icon: FaGithub, name: "GitHub" },
  { icon: Terminal, name: "Terminal" },
  { icon: Cpu, name: "LLMs" },
  { icon: Globe, name: "Cloud" },
  { icon: Sparkles, name: "Automation" },
];

export default function TechStack() {
  return (
    <section className="border-y border-white/10 bg-[#08080d] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-sm uppercase tracking-[0.3em] text-zinc-500">
          Powered By Modern Technologies
        </p>

        <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-8">
          {tech.map((item) => (
            <div
              key={item.name}
              className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-violet-500"
            >
              <item.icon className="h-8 w-8 text-violet-400" />

              <p className="text-sm text-zinc-300">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}