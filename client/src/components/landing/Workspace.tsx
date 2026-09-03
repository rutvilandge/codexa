import CodeWindow from "./CodeWindow";
import AIChat from "./AIChat";
import Terminal from "./Terminal";

export default function Workspace() {
  return (
    <section className="relative overflow-hidden bg-[#07070B] py-32">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-20 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-violet-700/20 blur-[180px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-20 text-center">
          <span className="uppercase tracking-[0.3em] text-violet-400">
            Workspace
          </span>

          <h2 className="mt-5 text-5xl font-black">
            Everything.
            <br />
            One Workspace.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-zinc-400">
            Write code, chat with AI, run commands and manage projects
            without switching between multiple tools.
          </p>
        </div>

        {/* Workspace Layout */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Monaco Editor */}
          <div className="lg:col-span-8">
            <CodeWindow />
          </div>

          {/* AI Chat */}
          <div className="lg:col-span-4">
            <AIChat />
          </div>

          {/* Terminal */}
          <div className="lg:col-span-12">
            <Terminal />
          </div>
        </div>
      </div>
    </section>
  );
}