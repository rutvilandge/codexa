import { FaGithub, FaGoogle } from "react-icons/fa";

export default function SocialLogin() {
  return (
    <div className="space-y-4">

      <button
        type="button"
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white backdrop-blur-xl transition-all duration-300 hover:border-violet-500 hover:bg-white/10"
      >
        <FaGoogle className="text-lg text-red-400" />

        Continue with Google
      </button>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white backdrop-blur-xl transition-all duration-300 hover:border-violet-500 hover:bg-white/10"
      >
        <FaGithub className="text-lg" />

        Continue with GitHub
      </button>

    </div>
  );
}