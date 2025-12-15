import { Schema, model, Document } from "mongoose";

export interface ITranscription extends Document {
  audioUrl: string;
  transcription: string;
  source?: string; // "azure" or "local"
  createdAt: Date;
}

const TranscriptionSchema = new Schema<ITranscription>({
  audioUrl: { type: String, required: true },
  transcription: { type: String, required: true },
  source: { type: String, default: "local" },
  createdAt: { type: Date, default: () => new Date(), index: true } // index: helpful for date queries
});

export const TranscriptionModel = model<ITranscription>("Transcription", TranscriptionSchema);
