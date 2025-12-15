import { Request, Response } from "express";
import { downloadAudioMock } from "../services/download.service";
import { createTranscription } from "../services/transcription.service";
import { retry } from "../utils/retry";
import { transcribeWithAzure } from "../services/azure.service";

export async function postAzureTranscription(req: Request, res: Response) {
  const { audioUrl, language = "en-US" } = req.body;

  await downloadAudioMock(audioUrl);

  const transcription = await retry(
    () => transcribeWithAzure(audioUrl, language),
    3
  );

  const doc = await createTranscription(
    audioUrl,
    transcription,
    "azure"
  );

  return res.json({ id: doc._id });
}
