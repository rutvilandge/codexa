import dotenv from "dotenv";
import { createServer } from "http";
dotenv.config();

import app from "./app";
import { createRealtimeServer } from "./realtime";

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);
createRealtimeServer(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
