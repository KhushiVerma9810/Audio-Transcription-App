import api from "../utils/api";

export const createTranscription = async (audioUrl: string) => {
  try {
    const response = await api.post("/transcription", { audioUrl });
    return response?.data;
  } catch (error) {
    console.error("Create transcription error:", error);
    throw error; 
  }
};

export const listTranscriptions = async () => {
  try {
    const response = await api.get("/transcriptions");
    return response?.data;
  } catch (error) {
    console.error("List transcriptions error:", error);
    throw error;
  }
};
