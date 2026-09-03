export default function AuthBackground() {
  return (
    <>
      {/* Main Background */}
      <div className="absolute inset-0 bg-[#07070B]" />

      {/* Purple Glow */}
      <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-violet-700/20 blur-[180px]" />

      {/* Pink Glow */}
      <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-fuchsia-600/20 blur-[180px]" />

      {/* Center Glow */}
      <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-[220px]" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right,#ffffff22 1px,transparent 1px),
            linear-gradient(to bottom,#ffffff22 1px,transparent 1px)
          `,
          backgroundSize: "45px 45px",
        }}
      />
    </>
  );
}