import { useState } from "react";
import { Command } from "cmdk";
import { useHotkeys } from "react-hotkeys-hook";
import {
  FileCode2,
  Sparkles,
  Folder,
  Search,
  Terminal,
} from "lucide-react";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);

  useHotkeys("ctrl+k", (e) => {
    e.preventDefault();
    setOpen((o) => !o);
  });

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/40 backdrop-blur-sm pt-28"
      onClick={() => setOpen(false)}
    >
      <Command
        onClick={(e) => e.stopPropagation()}
        className="w-[700px] overflow-hidden rounded-2xl border border-white/10 bg-[#0F0F15] shadow-2xl"
      >
        <div className="flex items-center border-b border-white/10 px-4">
          <Search size={18} className="text-zinc-500" />

          <Command.Input
            placeholder="Search files, commands, AI..."
            className="flex-1 bg-transparent px-3 py-4 text-white outline-none placeholder:text-zinc-500"
          />
        </div>

        <Command.List className="max-h-[420px] overflow-auto p-2">

          <Command.Empty className="p-6 text-center text-zinc-500">
            No results found.
          </Command.Empty>

          <Command.Group heading="Files">

            <Item
              icon={<FileCode2 size={18} />}
              title="Editor.tsx"
            />

            <Item
              icon={<FileCode2 size={18} />}
              title="Sidebar.tsx"
            />

            <Item
              icon={<Folder size={18} />}
              title="Workspace"
            />

          </Command.Group>

          <Command.Group heading="AI">

            <Item
              icon={<Sparkles size={18} />}
              title="Explain Selected Code"
              onSelect={() => window.dispatchEvent(new CustomEvent("codexa:ai-action", { detail: "explain" }))}
            />

            <Item
              icon={<Sparkles size={18} />}
              title="Generate React Component"
              onSelect={() => window.dispatchEvent(new CustomEvent("codexa:ai-action", { detail: "generate" }))}
            />

            <Item
              icon={<Sparkles size={18} />}
              title="Fix Errors"
              onSelect={() => window.dispatchEvent(new CustomEvent("codexa:ai-action", { detail: "fix" }))}
            />

          </Command.Group>

          <Command.Group heading="Workspace">

            <Item
              icon={<Terminal size={18} />}
              title="Open Terminal"
              onSelect={() => window.dispatchEvent(new Event("codexa:terminal-focus"))}
            />

          </Command.Group>

        </Command.List>
      </Command>
    </div>
  );
}

function Item({
  icon,
  title,
  onSelect,
}: {
  icon: React.ReactNode;
  title: string;
  onSelect?: () => void;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="
      flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-zinc-300
      aria-selected:bg-violet-500/20
      aria-selected:text-white
      "
    >
      {icon}

      {title}
    </Command.Item>
  );
}
