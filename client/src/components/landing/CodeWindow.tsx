import Editor from "@monaco-editor/react";

const code = `import { AI } from "@codexa/core";

const app = new AI();

await app.generate({
  prompt: "Build a modern SaaS dashboard"
});

await app.run();

console.log("🚀 Project Generated Successfully");
`;

export default function CodeWindow() {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0D1117] shadow-2xl">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">

        <div className="flex items-center gap-2">

          <div className="h-3 w-3 rounded-full bg-red-500" />

          <div className="h-3 w-3 rounded-full bg-yellow-500" />

          <div className="h-3 w-3 rounded-full bg-green-500" />

        </div>

        <p className="text-sm text-zinc-400">
          app.tsx
        </p>

      </div>

      <Editor
        height="480px"
        defaultLanguage="typescript"
        theme="vs-dark"
        defaultValue={code}
        options={{
          minimap: {
            enabled: false,
          },
          fontSize: 15,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: "on",
          padding: {
            top: 20,
          },
        }}
      />

    </div>
  );
}