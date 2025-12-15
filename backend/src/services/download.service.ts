import { retry } from "../utils/retry";

export async function downloadAudioMock(url: string): Promise<Buffer> {

  return retry(async () => {
    if (!url.startsWith("http")) throw new Error("invalid url");
    // return dummy buffer
    return Buffer.from("AUDIO_BYTES");
  }, 3, 200);
}
