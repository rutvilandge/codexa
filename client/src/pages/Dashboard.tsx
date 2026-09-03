import { type FormEvent, useEffect, useMemo, useState } from "react";
import { FolderCode, LoaderCircle, LogOut, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { createProject, deleteProject, getProjects, updateProject } from "@/services/projectApi";
import { useAuthStore } from "@/store/authStore";
import type { Project } from "@/types/project";

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
}

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const [projects, setProjects] = useState<Project[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [template, setTemplate] = useState<"basic" | "react">("basic");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    void loadProjects();
  }, []);

  const filteredProjects = useMemo(
    () => projects.filter((project) => `${project.name} ${project.description ?? ""}`.toLowerCase().includes(query.toLowerCase())),
    [projects, query]
  );

  async function loadProjects() {
    try {
      setError("");
      setProjects(await getProjects());
    } catch {
      setError("Unable to load projects. Please refresh and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function openNewProject() {
    setEditingProject(null);
    setName("");
    setDescription("");
    setTemplate("basic");
    setIsEditorOpen(true);
  }

  function openEditProject(project: Project) {
    setEditingProject(project);
    setName(project.name);
    setDescription(project.description ?? "");
    setIsEditorOpen(true);
  }

  async function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    try {
      if (editingProject) {
        const updated = await updateProject(editingProject.id, { name, description });
        setProjects((current) => current.map((project) => project.id === updated.id ? updated : project));
      } else {
        const created = await createProject({ name, description, template });
        setProjects((current) => [created, ...current]);
      }
      setIsEditorOpen(false);
    } catch {
      setError("Unable to save the project. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  async function removeProject(project: Project) {
    if (!window.confirm(`Delete “${project.name}”? This cannot be undone.`)) return;
    try {
      await deleteProject(project.id);
      setProjects((current) => current.filter((item) => item.id !== project.id));
    } catch {
      setError("Unable to delete the project. Please try again.");
    }
  }

  async function handleLogout() {
    await signOut();
    navigate("/login", { replace: true });
  }

  return (
    <main className="min-h-screen bg-[#0B0B0C] text-white">
      <header className="border-b border-white/10 bg-[#07070B]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div><h1 className="text-xl font-bold tracking-tight">Codexa</h1><p className="text-xs text-zinc-500">Your projects</p></div>
          <div className="flex items-center gap-3"><span className="hidden text-sm text-zinc-400 sm:block">{user?.name}</span><button type="button" onClick={() => void handleLogout()} className="rounded-lg border border-white/10 p-2 text-zinc-400 transition hover:border-violet-500/40 hover:text-white" title="Sign out"><LogOut size={17} /></button></div>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h2 className="text-3xl font-bold">Projects</h2><p className="mt-2 text-sm text-zinc-400">Create, organize, and continue your work.</p></div><button type="button" onClick={openNewProject} className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-violet-500"><Plus size={17} /> New Project</button></div>
        <div className="relative mb-7 max-w-md"><Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects..." className="w-full rounded-xl border border-white/10 bg-[#121216] py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-zinc-500 focus:border-violet-500/60" /></div>
        {error && <p className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
        {isLoading ? <div className="flex justify-center py-20 text-violet-300"><LoaderCircle className="animate-spin" /></div> : filteredProjects.length === 0 ? <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] py-16 text-center"><FolderCode className="mx-auto mb-4 text-violet-300" size={30} /><p className="font-medium">{projects.length ? "No matching projects" : "No projects yet"}</p><p className="mt-1 text-sm text-zinc-500">Create a project to start using the Codexa workspace.</p></div> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filteredProjects.map((project) => <article key={project.id} className="rounded-2xl border border-white/10 bg-[#121216] p-5 transition hover:border-violet-500/40 hover:bg-violet-500/[0.04]"><FolderCode size={23} className="mb-4 text-violet-300" /><h3 className="truncate font-semibold">{project.name}</h3><p className="mt-1 h-10 text-sm text-zinc-500">{project.description || "No description"}</p><dl className="mt-5 space-y-1 text-xs text-zinc-500"><div className="flex justify-between gap-2"><dt>Created</dt><dd>{formatDate(project.createdAt)}</dd></div><div className="flex justify-between gap-2"><dt>Updated</dt><dd>{formatDate(project.updatedAt)}</dd></div></dl><div className="mt-5 flex items-center gap-2"><button type="button" onClick={() => navigate(`/workspace/${project.id}`)} className="flex-1 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium transition hover:bg-violet-500">Open</button><button type="button" onClick={() => openEditProject(project)} className="rounded-lg border border-white/10 p-2 text-zinc-400 transition hover:text-white" title="Edit project"><Pencil size={16} /></button><button type="button" onClick={() => void removeProject(project)} className="rounded-lg border border-white/10 p-2 text-zinc-400 transition hover:border-red-500/40 hover:text-red-300" title="Delete project"><Trash2 size={16} /></button></div></article>)}</div>}
      </section>
      {isEditorOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"><form onSubmit={(event) => void saveProject(event)} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#121216] p-6 shadow-2xl"><h2 className="text-lg font-semibold">{editingProject ? "Edit Project" : "New Project"}</h2><div className="mt-5 space-y-4"><div><label className="mb-2 block text-sm text-zinc-300">Project name</label><input value={name} onChange={(event) => setName(event.target.value)} required autoFocus className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm outline-none focus:border-violet-500" /></div>{!editingProject && <div><label className="mb-2 block text-sm text-zinc-300">Template</label><select value={template} onChange={(event) => setTemplate(event.target.value as "basic" | "react")} className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm outline-none focus:border-violet-500"><option value="basic">Basic JavaScript</option><option value="react">React starter</option></select></div>}<div><label className="mb-2 block text-sm text-zinc-300">Description <span className="text-zinc-600">(optional)</span></label><textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm outline-none focus:border-violet-500" /></div></div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setIsEditorOpen(false)} className="rounded-lg px-3 py-2 text-sm text-zinc-400 hover:text-white">Cancel</button><button disabled={isSaving} className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium disabled:opacity-60">{isSaving ? "Saving..." : "Save Project"}</button></div></form></div>}
    </main>
  );
}
