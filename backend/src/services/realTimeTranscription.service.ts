const WORDS = [
  "hello",
  "this",
  "is",
  "a",
  "realtime",
  "transcription",
  "demo",
];

type RealtimeTranscriptionService = {
  processChunk: () => { partial: string };
  getFinalText: () => string;
};

export function createRealtimeTranscriptionService(): RealtimeTranscriptionService {
  let buffer: string[] = [];
  let index = 0;

  const processChunk = () => {
    const word = WORDS[index % WORDS.length];
    buffer.push(word);
    index++;

    return {
      partial: buffer.join(" "),
    };
  };

  const getFinalText = () => {
    return buffer.join(" ");
  };

  return {
    processChunk,
    getFinalText,
  };
}
