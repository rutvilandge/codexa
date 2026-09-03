export default function FloatingCards() {
  return (
    <div className="relative h-[620px] w-[620px]">

      {/* Center Glow */}
      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-[120px]" />

      {/* AI Core */}
      <div className="absolute left-[230px] top-[220px] flex h-40 w-40 items-center justify-center rounded-3xl border border-violet-500/30 bg-[#14141c]/90 shadow-2xl backdrop-blur-xl">
        <div className="text-center">
          <div className="text-5xl">🧠</div>
          <p className="mt-2 text-sm text-gray-300">AI Core</p>
        </div>
      </div>

      {/* Code Editor */}
      <div className="absolute left-0 top-30 w-72 rounded-3xl border border-white/10 bg-[#14141c]/90 p-5 backdrop-blur-xl">
        <div className="mb-4 flex gap-2">
          <div className="h-3 w-3 rounded-full bg-red-400"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
          <div className="h-3 w-3 rounded-full bg-green-400"></div>
        </div>

        <p className="text-xs text-gray-500">main.tsx</p>

        <div className="mt-3 space-y-2 font-mono text-sm">
          <p className="text-violet-400">const app = new AI();</p>
          <p className="text-sky-400">app.build();</p>
          <p className="text-green-400">✓ Compiled</p>
        </div>
      </div>

      {/* AI Chat */}
      <div className="absolute right-0 top-12 w-60 rounded-3xl border border-white/10 bg-[#14141c]/90 p-5 backdrop-blur-xl">
        <h3 className="mb-3 font-semibold">AI Assistant</h3>

        <div className="space-y-2 text-sm">
          <div className="rounded-xl bg-violet-600/20 p-2">
            Generate auth module
          </div>

          <div className="rounded-xl bg-white/5 p-2">
            ✔ Authentication created.
          </div>
        </div>
      </div>

      {/* Terminal */}
      <div className="absolute bottom-0 left-8 w-72 rounded-3xl border border-white/10 bg-black/70 p-5 font-mono backdrop-blur-xl">
        <p className="text-green-400">$ npm run dev</p>
        <p className="text-gray-400">Starting server...</p>
        <p className="text-violet-400">✔ localhost:5173</p>
      </div>

      {/* README */}
      <div className="absolute bottom-8 right-0 w-60 rounded-3xl border border-white/10 bg-[#14141c]/90 p-5 backdrop-blur-xl">
        <h3 className="font-semibold">README AI</h3>

        <p className="mt-3 text-sm text-gray-400">
          Documentation generated successfully.
        </p>

        <button className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm">
          Export
        </button>
      </div>

    </div>
  );
}