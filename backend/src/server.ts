import http from "node:http";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";

import app from "./app";
import { connectDB } from "./db/mongo";
import { registerTranscriptionSocket } from "./sockets/transcription.socket";

dotenv.config();

const PORT = process.env.PORT || 4000;

(async () => {
  await connectDB();

  const httpServer = http.createServer(app);

  if (!process.env.CLIENT_URL) {
    throw new Error("CLIENT_URL is not found");
  }
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
    },
  });

  registerTranscriptionSocket(io);

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})();
