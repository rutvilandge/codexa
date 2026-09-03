import { Sparkles } from "lucide-react";

interface Props {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function AuthCard({
  title,
  subtitle,
  children,
}: Props) {
  return (
    <div
      className="
      w-full
      max-w-md
      rounded-3xl
      border
      border-white/10
      bg-white/5
      backdrop-blur-2xl
      p-10
      shadow-2xl
      "
    >
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600">
          <Sparkles className="h-6 w-6 text-white" />
        </div>

        <div>
          <h1 className="text-3xl font-black text-white">
            Codexa
          </h1>

          <p className="text-sm text-zinc-400">
            AI Software Engineering Workspace
          </p>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-white">
        {title}
      </h2>

      <p className="mt-2 text-zinc-400">
        {subtitle}
      </p>

      <div className="mt-8">
        {children}
      </div>
    </div>
  );
}