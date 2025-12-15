import { Schema, model } from "mongoose";

const RealtimeSessionSchema = new Schema({
  socketId: String,
  audioChunks: Number,
  transcription: String,
  startedAt: Date,
  endedAt: Date,
});

export const RealtimeSession = model(
  "RealtimeSession",
  RealtimeSessionSchema
);
