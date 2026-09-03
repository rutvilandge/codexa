import {
  Folder,
  FileCode,
} from "lucide-react";

export default function Explorer() {
  return (
    <div className="p-4">

      <h2 className="text-xs uppercase text-zinc-400 mb-4">
        Explorer
      </h2>

      <div className="space-y-3">

        <div className="flex items-center gap-2">

          <Folder
            size={18}
            className="text-yellow-400"
          />

          <span>src</span>

        </div>

        <div className="ml-6 flex items-center gap-2">

          <FileCode
            size={16}
            className="text-blue-400"
          />

          <span>App.tsx</span>

        </div>

      </div>

    </div>
  );
}