import { Router } from "express";
import multer from "multer";
import { groq } from "../lib/groq.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

// Parse PDF to text using a manual approach (pdf-parse alternative)
async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    // Try to use dynamic import of pdf-parse
    const pdfParse = await import("pdf-parse/lib/pdf-parse.js" as string).catch(() => null);
    if (pdfParse) {
      const data = await (pdfParse as { default: (buf: Buffer) => Promise<{ text: string }> }).default(buffer);
      return data.text;
    }
  } catch {
    // fallback
  }

  // Simple fallback: extract raw text from PDF buffer
  const text = buffer.toString("latin1");
  const matches = text.match(/BT[\s\S]*?ET/g) || [];
  const extracted = matches
    .join(" ")
    .replace(/\(([^)]+)\)\s*Tj/g, "$1 ")
    .replace(/[^\x20-\x7E\n]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return extracted || "Unable to extract text from this PDF. Please ensure it contains selectable text (not a scanned image).";
}

// Store PDF sessions in memory (in production, use DB)
const pdfSessions = new Map<string, { text: string; filename: string; uploadedAt: Date }>();

router.post("/pdf/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "PDF file is required" });
      return;
    }

    const text = await extractPdfText(req.file.buffer);
    const sessionId = `pdf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    pdfSessions.set(sessionId, {
      text: text.slice(0, 100000), // limit to 100k chars
      filename: req.file.originalname || "document.pdf",
      uploadedAt: new Date(),
    });

    // Auto-cleanup after 1 hour
    setTimeout(() => pdfSessions.delete(sessionId), 60 * 60 * 1000);

    // Generate initial summary
    const summaryRes = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert at analyzing and summarizing academic documents.",
        },
        {
          role: "user",
          content: `Analyze this document and provide a structured overview:

DOCUMENT TEXT (first portion):
${text.slice(0, 8000)}

Provide:
## 📄 Document Overview
- Title/Subject (inferred)
- Total content scope
- Main themes

## 📋 Key Topics Covered
List the main topics/chapters/sections found

## 💡 Quick Summary
3-4 sentence summary of the entire document

## 🎯 What You Can Ask Me
Examples of useful questions you can ask about this document`,
        },
      ],
      max_tokens: 1500,
    });

    const summary = summaryRes.choices[0]?.message?.content || "Document uploaded successfully.";

    res.json({
      sessionId,
      filename: req.file.originalname,
      charCount: text.length,
      summary,
    });
  } catch (error: unknown) {
    console.error("PDF upload error:", error);
    res.status(500).json({ error: "Failed to process PDF" });
  }
});

router.post("/pdf/ask", async (req, res) => {
  try {
    const { sessionId, question, mode = "qa" } = req.body as {
      sessionId: string;
      question: string;
      mode?: "qa" | "summarize" | "flashcards" | "quiz";
    };

    const session = pdfSessions.get(sessionId);
    if (!session) {
      res.status(404).json({ error: "PDF session not found. Please re-upload your PDF." });
      return;
    }

    const pdfContext = session.text.slice(0, 12000);

    let prompt = "";
    if (mode === "summarize") {
      prompt = `Summarize the section about: "${question}" from this document.\n\nDOCUMENT:\n${pdfContext}`;
    } else if (mode === "flashcards") {
      prompt = `Generate 10 flashcards (question and answer format) from this document about: "${question}"\n\nDOCUMENT:\n${pdfContext}\n\nFormat as:\n**Q:** [question]\n**A:** [answer]\n\n(repeat for each card)`;
    } else if (mode === "quiz") {
      prompt = `Create a 5-question multiple choice quiz from this document about: "${question}"\n\nDOCUMENT:\n${pdfContext}\n\nFormat each question with options A-D and mark the correct answer.`;
    } else {
      prompt = `Based on the document below, answer this question accurately and thoroughly: "${question}"\n\nIf the answer isn't in the document, say so clearly.\n\nDOCUMENT:\n${pdfContext}`;
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an expert at analyzing the document: "${session.filename}". Answer questions accurately based on the document content. Always cite relevant sections when possible.`,
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 2000,
    });

    const answer = response.choices[0]?.message?.content || "Unable to generate an answer.";
    res.json({ answer, mode });
  } catch (error: unknown) {
    console.error("PDF ask error:", error);
    res.status(500).json({ error: "Failed to process your question" });
  }
});

export default router;
