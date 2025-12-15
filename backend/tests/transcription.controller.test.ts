import request from "supertest";
import app from "../src/app";

describe("POST /api/transcription", () => {
  it("should create a transcription", async () => {
    const res = await request(app)
      .post("/api/transcription")
      .send({
        audioUrl: "https://example.com/sample.mp3",
      });

    expect(res.status).toBe(200);
    expect(res.body.id).toBeDefined();
  });

  it("should fail without audioUrl", async () => {
    const res = await request(app)
      .post("/api/transcription")
      .send({});

    expect(res.status).toBe(400);
  });
});
