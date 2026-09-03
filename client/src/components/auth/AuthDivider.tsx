export default function AuthDivider() {
  return (
    <div className="my-8 flex items-center gap-4">

      <div className="h-px flex-1 bg-white/10" />

      <span className="text-xs uppercase tracking-[0.25em] text-zinc-500">
        OR
      </span>

      <div className="h-px flex-1 bg-white/10" />

    </div>
  );
}
