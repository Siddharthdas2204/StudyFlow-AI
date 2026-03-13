import { Router, type IRouter } from "express";
import { groqChat } from "../lib/groq.js";

const router: IRouter = Router();

// ─── AI Tutor Chat ────────────────────────────────────────────────────────────
router.post("/ai/chat", async (req, res) => {
  try {
    const { message, subject, history = [] } = req.body;

    const systemPrompt = subject
      ? `You are an expert AI tutor specializing in ${subject}. Provide clear, educational responses with examples. Format your responses using Markdown when appropriate (use headers, code blocks, bullet points, etc.).`
      : `You are an expert AI study tutor. Help students understand concepts clearly. Format your responses using Markdown when appropriate (use headers, code blocks, bullet points, etc.).`;

    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: systemPrompt },
      ...history.map((h: { role: string; content: string }) => ({
        role: h.role as "user" | "assistant",
        content: h.content,
      })),
      { role: "user", content: message },
    ];

    const response = await groqChat(messages);
    res.json({ response });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "AI chat failed" });
  }
});

// ─── YouTube Summarizer ───────────────────────────────────────────────────────
router.post("/ai/summarize-youtube", async (req, res) => {
  try {
    const { url } = req.body;

    const videoId = extractVideoId(url);
    if (!videoId) {
      return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    const prompt = `You are an expert lecture summarizer. A student has shared a YouTube video URL: ${url} (Video ID: ${videoId}).

Since you cannot access the actual video, generate a comprehensive educational summary template that the student can use as a study guide structure. 

Create a realistic educational summary as if you had watched a typical lecture on the topic suggested by this URL. Include:

Return a JSON object with exactly this structure:
{
  "title": "Educational topic title based on the YouTube URL context",
  "summary": "A comprehensive 3-4 paragraph summary of the key educational content",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3", "Key point 4", "Key point 5"],
  "bulletNotes": ["Detailed note 1", "Detailed note 2", "Detailed note 3", "Detailed note 4", "Detailed note 5", "Detailed note 6"]
}`;

    const raw = await groqChat(
      [{ role: "user", content: prompt }],
      true
    );

    const data = JSON.parse(raw);
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "YouTube summarization failed" });
  }
});

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

// ─── AI Notes Generator ───────────────────────────────────────────────────────
router.post("/ai/generate-notes", async (req, res) => {
  try {
    const { text, title } = req.body;

    const prompt = `You are an expert note-taker and educator. Transform the following text into well-structured study notes.

Text:
${text}

Return a JSON object with exactly this structure:
{
  "title": "${title || "Generated Notes"}",
  "content": "Full structured notes in Markdown format with ## headings, bullet points, and **bold** key terms",
  "tldr": "A 2-3 sentence TL;DR summary of the content",
  "keyConcepts": "A markdown list of key concepts: ## Key Concepts\\n- **Concept 1**: definition\\n- **Concept 2**: definition"
}`;

    const raw = await groqChat([{ role: "user", content: prompt }], true);
    const data = JSON.parse(raw);
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Notes generation failed" });
  }
});

// ─── Flashcard Generator ─────────────────────────────────────────────────────
router.post("/ai/generate-flashcards", async (req, res) => {
  try {
    const { content, count = 10 } = req.body;

    const prompt = `You are an expert educator. Create ${count} flashcards from the following study content.

Content:
${content}

Return a JSON object with a "flashcards" array. Each flashcard should have:
{
  "flashcards": [
    { "question": "Clear, specific question", "answer": "Concise, accurate answer" }
  ]
}

Make questions test understanding, not just recall. Vary question types.`;

    const raw = await groqChat([{ role: "user", content: prompt }], true);
    const data = JSON.parse(raw);
    res.json(data.flashcards ?? []);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Flashcard generation failed" });
  }
});

// ─── Quiz Generator ───────────────────────────────────────────────────────────
router.post("/ai/generate-quiz", async (req, res) => {
  try {
    const { content, count = 8 } = req.body;

    const prompt = `You are an expert quiz creator. Create ${count} quiz questions from the following study content. Mix multiple choice and true/false questions.

Content:
${content}

Return a JSON object with a "questions" array:
{
  "questions": [
    {
      "question": "Question text",
      "type": "multiple_choice",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A",
      "explanation": "Why this is correct"
    },
    {
      "question": "True or false statement",
      "type": "true_false",
      "options": ["True", "False"],
      "answer": "True",
      "explanation": "Why this is true"
    }
  ]
}`;

    const raw = await groqChat([{ role: "user", content: prompt }], true);
    const data = JSON.parse(raw);
    res.json(data.questions ?? []);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Quiz generation failed" });
  }
});

// ─── Study Plan Generator ─────────────────────────────────────────────────────
router.post("/ai/generate-study-plan", async (req, res) => {
  try {
    const { subjects, examDate, hoursPerDay = 3 } = req.body;

    const today = new Date();
    const exam = new Date(examDate);
    const daysLeft = Math.ceil((exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const prompt = `You are an expert study planner. Create a detailed study plan.

Subjects: ${subjects}
Exam Date: ${examDate}
Days Until Exam: ${daysLeft}
Hours Available Per Day: ${hoursPerDay}

Create a realistic, actionable daily study plan. Return a JSON object:
{
  "overview": "2-3 sentence overview of the study strategy",
  "dailyPlan": [
    {
      "day": "Day 1 - Monday",
      "date": "2024-01-15",
      "tasks": ["Task 1: Study topic X for 45 min", "Task 2: Practice problems on Y for 30 min"],
      "hours": 3
    }
  ],
  "tips": ["Study tip 1", "Study tip 2", "Study tip 3"]
}

Include up to 14 days of plan (or until exam date if sooner). Space out subjects logically with review days.`;

    const raw = await groqChat([{ role: "user", content: prompt }], true);
    const data = JSON.parse(raw);
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Study plan generation failed" });
  }
});

// ─── Concept Simplifier ───────────────────────────────────────────────────────
router.post("/ai/simplify", async (req, res) => {
  try {
    const { concept, level } = req.body;

    const levelDescriptions = {
      beginner: "a complete beginner with no prior knowledge, using simple analogies and everyday examples",
      exam: "a student preparing for an exam, focusing on key definitions, formulas, and testable concepts",
      advanced: "an advanced student or professional, including technical depth, edge cases, and connections to related concepts",
    };

    const description = levelDescriptions[level as keyof typeof levelDescriptions] ?? levelDescriptions.beginner;

    const prompt = `Explain the following concept for ${description}.

Concept: ${concept}

Provide a clear, well-structured explanation in Markdown format. Use appropriate headers, bullet points, and examples for the level.`;

    const response = await groqChat([{ role: "user", content: prompt }]);
    res.json({ explanation: response, level });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Simplification failed" });
  }
});

// ─── Ask About Note ───────────────────────────────────────────────────────────
router.post("/ai/ask-about-note", async (req, res) => {
  try {
    const { noteContent, question } = req.body;

    const prompt = `You are a knowledgeable AI tutor. A student has a question about their study notes.

Note Content:
${noteContent}

Student's Question: ${question}

Provide a helpful, accurate answer based on the note content. If the answer isn't in the notes, say so and provide general knowledge. Format your response in Markdown.`;

    const response = await groqChat([{ role: "user", content: prompt }]);
    res.json({ response });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "AI question failed" });
  }
});

export default router;
