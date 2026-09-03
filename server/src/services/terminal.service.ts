import { spawn } from "child_process";
import path from "path";
import { getAccessibleWorkspace } from "./project-access.service";

const ALLOWED_COMMANDS = new Set([
  "npm",
  "npx",
  "pnpm",
  "yarn",
  "git",
  "node",
  "echo",
]);

const UNSAFE_TOKENS = /[;&|`$<>\n\r]/;

const ALLOWED_GIT_COMMANDS = new Set([
  "status",
  "diff",
  "log",
  "branch",
  "switch",
  "checkout",
  "add",
  "commit",
  "pull",
  "push",
  "merge",
  "init",
]);

const ALLOWED_PACKAGE_COMMANDS = new Set([
  "install",
  "ci",
  "run",
  "test",
  "build",
  "start",
  "dev",
]);

function parseCommand(command: string) {
  if (UNSAFE_TOKENS.test(command)) {
    throw new Error("Shell operators are not allowed");
  }

  const parts = command.trim().split(/\s+/);
  const executable = parts.shift();

  if (
    !executable ||
    !ALLOWED_COMMANDS.has(executable)
  ) {
    throw new Error(
      "This command is not allowed in the project terminal"
    );
  }

  if (
    parts.some(
      (part) =>
        part.includes("..") ||
        path.isAbsolute(part)
    )
  ) {
    throw new Error(
      "Commands may only access the current project"
    );
  }

  const subcommand = parts[0];

  if (
    executable === "git" &&
    !ALLOWED_GIT_COMMANDS.has(subcommand ?? "")
  ) {
    throw new Error("That Git command is not allowed");
  }

  if (
    ["npm", "pnpm", "yarn"].includes(executable) &&
    !ALLOWED_PACKAGE_COMMANDS.has(subcommand ?? "")
  ) {
    throw new Error(
      "That package command is not allowed"
    );
  }

  return {
    executable,
    arguments: parts,
  };
}

export async function runProjectCommand(
  projectId: string,
  ownerId: string,
  command: string,
  onOutput: (output: string) => void
) {
  const workspacePath =
    await getAccessibleWorkspace(
      projectId,
      ownerId,
      true
    );

  const {
    executable,
    arguments: argumentsList,
  } = parseCommand(command);

  return new Promise<number>((resolve, reject) => {
    const child = spawn(
      executable,
      argumentsList,
      {
        cwd: workspacePath,
        env: process.env,
        shell: false,
      }
    );

    child.stdout.on(
      "data",
      (chunk: Buffer) => {
        onOutput(chunk.toString());
      }
    );

    child.stderr.on(
      "data",
      (chunk: Buffer) => {
        onOutput(chunk.toString());
      }
    );

    child.on("error", reject);

    child.on("close", (code) => {
      resolve(code ?? 1);
    });
  });
}