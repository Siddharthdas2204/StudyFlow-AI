import { Router } from "express";
import multer from "multer";
import { groq } from "../lib/groq.js";
import fs from "fs";
import path from "path";
import os from "os";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

router.post("/lecture/transcribe", upload.single("audio"), async (req, res) => {
  let tempPath = "";
  try {
    const subject = req.body.subject || "General";

    if (!req.file) {
      res.status(400).json({ error: "Audio file is required" });
      return;
    }

    // Write buffer to temp file (Groq needs a file stream)
    const ext = req.file.originalname?.split(".").pop() || "mp3";
    tempPath = path.join(os.tmpdir(), `lecture_${Date.now()}.${ext}`);
    fs.writeFileSync(tempPath, req.file.buffer);

    // Transcribe with Groq Whisper
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(tempPath),
      model: "whisper-large-v3",
      language: "en",
      response_format: "text",
    });

    const rawTranscript = typeof transcription === "string" ? transcription : (transcription as { text: string }).text || "";

    // Convert transcript to structured notes
    const notesResponse = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an expert note-taker. Convert lecture transcripts into well-structured, comprehensive study notes.`,
        },
        {
          role: "user",
          content: `Convert this lecture transcript into structured study notes for the subject: ${subject}

TRANSCRIPT:
${rawTranscript}

Create organized notes with:
- ## Overview (main topic and objectives)
- ## Key Concepts (bullet points for each major concept)
- ## Detailed Notes (sections with headings for each topic covered)
- ## Important Definitions (key terms and their meanings)
- ## Summary (brief recap of the most important points)
- ## Study Questions (3-5 questions to test understanding)

Format everything in clean markdown.`,
        },
      ],
      max_tokens: 3000,
    });

    const notes = notesResponse.choices[0]?.message?.content || "Failed to generate notes.";

    res.json({
      transcript: rawTranscript,
      notes,
      wordCount: rawTranscript.split(/\s+/).length,
    });
  } catch (error: unknown) {
    console.error("Lecture transcription error:", error);
    const message = error instanceof Error ? error.message : "Failed to transcribe lecture";
    res.status(500).json({ error: message });
  } finally {
    if (tempPath && fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
  }
});

export default router;
