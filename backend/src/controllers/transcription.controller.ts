import { Request, Response } from "express";
import { downloadAudioMock } from "../services/download.service";
import {
  createTranscription,
  getTranscriptionsLast30Days,
} from "../services/transcription.service";

export async function postTranscription(req: Request, res: Response) {
  const { audioUrl } = req.body;

  await downloadAudioMock(audioUrl);

  const transcription = "transcribed text";

  const doc = await createTranscription(audioUrl, transcription, "local");

  return res.json({ id: doc._id });
}

export async function getTranscriptions(req: Request, res: Response) {
  const list = await getTranscriptionsLast30Days();
  return res.json({ transcriptions: list });
}
