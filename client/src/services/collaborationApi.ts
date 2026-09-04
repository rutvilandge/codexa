import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

function getSocket() {
  if (!socket) {
    socket = io(
      import.meta.env.VITE_SOCKET_URL ?? "http://localhost:5000",
      {
        withCredentials: true,
        autoConnect: false,
      }
    );
  }

  return socket;
}

export function joinProjectRoom(
  projectId: string,
  handlers: {
    onFileChange: (change: { path: string; content: string }) => void;
    onPresence: (users: Array<{ id: string }>) => void;
  }
) {
  // Vercel serverless does not run the persistent Socket.IO server.
  if (import.meta.env.PROD) {
    return () => {};
  }

  const activeSocket = getSocket();

  activeSocket.on("file:change", handlers.onFileChange);
  activeSocket.on("presence:update", handlers.onPresence);

  activeSocket.connect();
  activeSocket.emit("project:join", projectId);

  return () => {
    activeSocket.off("file:change", handlers.onFileChange);
    activeSocket.off("presence:update", handlers.onPresence);
    activeSocket.disconnect();
  };
}

export function broadcastFileChange(
  projectId: string,
  path: string,
  content: string
) {
  if (import.meta.env.PROD) return;

  getSocket().emit("file:change", {
    projectId,
    path,
    content,
  });
}

export function broadcastCursor(
  projectId: string,
  path: string,
  selection: unknown
) {
  if (import.meta.env.PROD) return;

  getSocket().emit("cursor:update", {
    projectId,
    path,
    selection,
  });
}