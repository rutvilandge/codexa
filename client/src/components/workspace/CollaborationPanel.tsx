import { useEffect, useState } from "react";
import { UserPlus, Users } from "lucide-react";
import { getCollaborators, inviteCollaborator, removeCollaborator, type Collaborator } from "@/services/collaboratorApi";

export default function CollaborationPanel({ projectId }: { projectId: string }) {
  const [members, setMembers] = useState<Collaborator[]>([]);
  const [message, setMessage] = useState("");
  const load = async () => { try { const data = await getCollaborators(projectId); setMembers(data.members); } catch { setMessage("Collaborators unavailable."); } };
  useEffect(() => { void load(); }, [projectId]);
  const invite = async () => {
    const email = window.prompt("Collaborator email");
    if (!email?.trim()) return;
    const role = window.confirm("Give this collaborator edit permission?\nChoose Cancel for view-only access.") ? "EDITOR" : "VIEWER";
    try { await inviteCollaborator(projectId, email.trim(), role); await load(); } catch { setMessage("Unable to invite that user. They must have a Codexa account."); }
  };
  return <section className="border-t border-white/10 p-3"><div className="mb-2 flex items-center justify-between text-xs font-medium text-zinc-300"><span className="flex items-center gap-1.5"><Users size={14} className="text-violet-400" />Collaborators</span><button type="button" onClick={() => void invite()} className="rounded p-1 text-zinc-400 hover:bg-white/10 hover:text-white" title="Invite collaborator"><UserPlus size={14} /></button></div>{members.length ? <div className="space-y-1">{members.slice(0, 3).map((member) => <div key={member.id} className="flex items-center gap-2 text-[11px] text-zinc-400"><span className="min-w-0 flex-1 truncate">{member.user.name}</span><span className="text-zinc-600">{member.role.toLowerCase()}</span><button type="button" onClick={() => void removeCollaborator(projectId, member.id).then(load)} className="text-zinc-600 hover:text-red-300" title="Remove collaborator">×</button></div>)}</div> : <p className="text-[11px] text-zinc-500">Only you have access.</p>}{message && <p className="mt-2 text-[11px] text-red-300">{message}</p>}</section>;
}
