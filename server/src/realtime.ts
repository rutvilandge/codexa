import type { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";

import { requireProjectAccess } from "./services/project-access.service";

type SocketUser = { id: string };

function getCookieValue(cookieHeader: string | undefined, name: string) {
  return cookieHeader?.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${name}=`))?.slice(name.length + 1);
}

export function createRealtimeServer(httpServer: HttpServer) {
  const io = new Server(httpServer, { cors: { origin: process.env.CLIENT_URL ?? "http://localhost:5173", credentials: true } });
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token ?? getCookieValue(socket.handshake.headers.cookie, "token");
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as SocketUser;
      socket.data.user = payload;
      next();
    } catch { next(new Error("Unauthorized")); }
  });
  io.on("connection", (socket) => {
    socket.on("project:join", async (projectId: unknown, done?: (result: { ok: boolean; message?: string }) => void) => {
      if (typeof projectId !== "string") return done?.({ ok: false, message: "Invalid project" });
      try {
        await requireProjectAccess(projectId, socket.data.user.id);
        const room = `project:${projectId}`;
        socket.join(room);
        const users = (await io.in(room).fetchSockets()).map((peer) => ({ id: peer.data.user.id }));
        io.to(room).emit("presence:update", users);
        done?.({ ok: true });
      } catch { done?.({ ok: false, message: "Project access denied" }); }
    });
    socket.on("file:change", async (payload: { projectId?: unknown; path?: unknown; content?: unknown }) => {
      if (typeof payload?.projectId !== "string" || typeof payload.path !== "string" || typeof payload.content !== "string") return;
      try { await requireProjectAccess(payload.projectId, socket.data.user.id, true); socket.to(`project:${payload.projectId}`).emit("file:change", { path: payload.path, content: payload.content, userId: socket.data.user.id }); } catch { /* authorization failure is intentionally silent */ }
    });
    socket.on("cursor:update", async (payload: { projectId?: unknown; path?: unknown; selection?: unknown }) => {
      if (typeof payload?.projectId !== "string" || typeof payload.path !== "string") return;
      try { await requireProjectAccess(payload.projectId, socket.data.user.id); socket.to(`project:${payload.projectId}`).emit("cursor:update", { path: payload.path, selection: payload.selection, userId: socket.data.user.id }); } catch { /* authorization failure is intentionally silent */ }
    });
    socket.on("disconnecting", () => {
      for (const room of socket.rooms) if (room.startsWith("project:")) setTimeout(async () => {
        const users = (await io.in(room).fetchSockets()).map((peer) => ({ id: peer.data.user.id }));
        io.to(room).emit("presence:update", users);
      }, 0);
    });
  });
  return io;
}
