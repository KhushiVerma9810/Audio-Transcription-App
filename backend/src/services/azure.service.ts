export async function transcribeWithAzure(
  audioUrl: string,
  language = "en-US"
): Promise<string> {
  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;

  if (!key || !region) {
    return "transcribed text (mock)";
  }

  // Real Azure SDK would go here
  // Wrapped in timeout & retry (stubbed)
  return "[azure transcription result]";
}
