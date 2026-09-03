import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  placeholder?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  name?: string;
  autoComplete?: string;
  required?: boolean;
}

export default function PasswordInput({
  placeholder = "Password",
  value,
  onChange,
  name,
  autoComplete,
  required,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">

      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        autoComplete={autoComplete}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-white outline-none placeholder:text-zinc-500 focus:border-violet-500"
      />

      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>

    </div>
  );
}
