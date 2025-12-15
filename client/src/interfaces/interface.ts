export interface TranscriptionData {
  text: string;
  timestamp: number;
  isFinal: boolean;
}

export interface Transcription {
  id: string;
  audioUrl: string;
  status: string;
  createdAt: string;
}

export interface TranscriptionResponse {
  id: string;
  message: string;
}