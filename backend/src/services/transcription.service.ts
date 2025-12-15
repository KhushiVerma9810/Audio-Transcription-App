import { TranscriptionModel } from "../models/transcription.model";

export async function createTranscription(audioUrl: string, transcription: string, source = "local") {
  const doc = await TranscriptionModel.create({ audioUrl, transcription, source, createdAt: new Date() });
  return doc;
}

export async function getTranscriptionsLast30Days() {
  const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
  return TranscriptionModel.find({ createdAt: { $gte: since } }).sort({ createdAt: -1 }).lean();
}
