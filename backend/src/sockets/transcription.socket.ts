import { Server, Socket } from "socket.io";
import { createRealtimeTranscriptionService } from "../services/realTimeTranscription.service";
import { RealtimeSession } from "../models/RealtimeTranscriptionSession.model";

export function registerTranscriptionSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("Client connected:", socket.id);

    const service = createRealtimeTranscriptionService();
    let chunkCount = 0;
    const startedAt = new Date();

    socket.on("audio-chunk", () => {
      chunkCount++;

      const partialResult = service.processChunk();
      socket.emit("transcription-partial", partialResult);
    });

    socket.on("end-stream", async () => {
      const finalText = service.getFinalText();

      await RealtimeSession.create({
        socketId: socket.id,
        audioChunks: chunkCount,
        transcription: finalText,
        startedAt,
        endedAt: new Date(),
      });

      socket.emit("transcription-final", { final: finalText });
      socket.disconnect();
    });
  });
}
