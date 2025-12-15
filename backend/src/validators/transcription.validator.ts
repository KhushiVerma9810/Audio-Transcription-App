import { z } from "zod";

export const postTranscriptionSchema = z.object({
  audioUrl: z.string()
    .trim()
    .min(1, "Audio URL is required")
    .regex(
      /^https?:\/\/.+/,
      "Please provide a valid audio URL"
    ),
});

export type PostTranscriptionBody = z.infer<typeof postTranscriptionSchema>;
