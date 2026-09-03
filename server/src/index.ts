import dotenv from "dotenv";
import { createServer } from "http";
import app from "./app";
import { createRealtimeServer } from "./realtime";

dotenv.config();

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);
createRealtimeServer(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 Codexa Backend running on http://localhost:${PORT}`);
});
