import { Router } from "express";
import { groq } from "../lib/groq.js";
import { db, notesTable } from "@workspace/db";

const router = Router();

router.post("/exam/predict", async (req, res) => {
  try {
    const { subject, examDate, difficulty = "medium", noteIds } = req.body as {
      subject: string;
      examDate?: string;
      difficulty?: string;
      noteIds?: number[];
    };

    // Fetch notes for context
    let notesContext = "";
    if (noteIds && noteIds.length > 0) {
      const fetchedNotes = await db.select().from(notesTable);
      const filtered = fetchedNotes.filter(n => noteIds.includes(n.id));
      notesContext = filtered.map(n => `**${n.title}**\n${n.content}`).join("\n\n---\n\n");
    } else {
      const allNotes = await db.select().from(notesTable);
      notesContext = allNotes.slice(0, 5).map(n => `**${n.title}**\n${n.content}`).join("\n\n---\n\n");
    }

    const daysUntilExam = examDate
      ? Math.ceil((new Date(examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : null;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert exam strategist and academic tutor. Analyze study material and predict likely exam questions based on topic importance and patterns.",
        },
        {
          role: "user",
          content: `Analyze the following study material and predict exam questions for: ${subject}
${daysUntilExam !== null ? `Exam is in ${daysUntilExam} days.` : ""}
Difficulty level: ${difficulty}

STUDY MATERIAL:
${notesContext || "No specific notes provided - use general knowledge of " + subject}

Generate a comprehensive exam prediction report with:

## 🎯 High-Priority Topics (Very Likely to Appear)
List the 5-7 most important topics that are almost certain to appear on the exam.

## 📝 Predicted Exam Questions
Generate 15 exam questions across these categories:
### Multiple Choice (5 questions with options A-D and correct answer)
### Short Answer (5 questions with expected answer length)
### Long Answer / Essay (3 questions with marking rubric hints)
### Problem-Solving (2 questions if applicable to subject)

## ⚡ Must-Know Concepts
List 10 key concepts, formulas, or definitions that must be memorized.

## 🗓️ Study Priority Order
Rank topics from most to least important for exam preparation.

## 💡 Exam Strategy Tips
3-5 specific tips for this subject's exam.

Format everything clearly in markdown.`,
        },
      ],
      max_tokens: 3000,
    });

    const prediction = response.choices[0]?.message?.content || "Failed to generate exam predictions.";
    res.json({ prediction, subject, difficulty, daysUntilExam });
  } catch (error: unknown) {
    console.error("Exam predictor error:", error);
    const message = error instanceof Error ? error.message : "Failed to predict exam questions";
    res.status(500).json({ error: message });
  }
});

export default router;
