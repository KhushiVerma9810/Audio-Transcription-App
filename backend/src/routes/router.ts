import { Router } from "express";
import { postTranscription, getTranscriptions } from "../controllers/transcription.controller";
import { postAzureTranscription } from "../controllers/azure.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { postTranscriptionSchema } from "../validators/transcription.validator";
import { validate } from "../validators/validators.validate";
const router = Router();

router.post(
  "/transcription",
  validate(postTranscriptionSchema),
  asyncHandler(postTranscription)
);

router.get(
  "/transcriptions",
  asyncHandler(getTranscriptions)
);

router.post(
  "/azure-transcription",
  validate(postTranscriptionSchema),
  asyncHandler(postAzureTranscription)
);


export default router;
