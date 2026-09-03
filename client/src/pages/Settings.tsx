import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { updateCurrentUser } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function Settings() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [name, setName] = useState(user?.name ?? "");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  async function save() {
    setSaving(true); setStatus("");
    try { const response = await updateCurrentUser({ name }); updateUser(response.user); setStatus("Profile updated."); }
    catch { setStatus("Unable to update profile."); }
    finally { setSaving(false); }
  }
  return <main className="min-h-screen bg-[#0B0B0C] px-5 py-10 text-white"><section className="mx-auto max-w-xl"><div className="flex items-center justify-between"><Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"><ArrowLeft size={16} />Back to projects</Link><ThemeToggle /></div><h1 className="mt-8 text-3xl font-bold">Settings</h1><p className="mt-2 text-sm text-zinc-500">Manage your profile and local workspace preferences.</p><div className="mt-7 rounded-2xl border border-white/10 bg-[#121216] p-6"><label className="mb-2 block text-sm text-zinc-300">Display name</label><input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 outline-none focus:border-violet-500" /><p className="mt-3 text-sm text-zinc-500">Email: {user?.email}</p><button type="button" disabled={saving || !name.trim()} onClick={() => void save()} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium hover:bg-violet-500 disabled:opacity-50"><Save size={15} />{saving ? "Saving…" : "Save changes"}</button>{status && <p className="mt-3 text-sm text-zinc-400">{status}</p>}</div></section></main>;
}
