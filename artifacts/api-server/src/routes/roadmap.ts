import { Router } from "express";
import { groq } from "../lib/groq.js";

const router = Router();

router.post("/roadmap/generate", async (req, res) => {
  try {
    const {
      subject,
      currentLevel = "beginner",
      targetLevel = "advanced",
      examDate,
      hoursPerDay = 2,
      syllabus = "",
      goals = "",
    } = req.body as {
      subject: string;
      currentLevel?: string;
      targetLevel?: string;
      examDate?: string;
      hoursPerDay?: number;
      syllabus?: string;
      goals?: string;
    };

    const daysAvailable = examDate
      ? Math.ceil((new Date(examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : 30;

    const totalHours = daysAvailable * hoursPerDay;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert academic coach and curriculum designer. Create detailed, personalized study roadmaps that are practical and achievable.",
        },
        {
          role: "user",
          content: `Create a comprehensive personalized study roadmap for:

**Subject:** ${subject}
**Current Level:** ${currentLevel}
**Target Level:** ${targetLevel}
**Available Time:** ${daysAvailable} days (${hoursPerDay} hours/day = ${totalHours} total hours)
${syllabus ? `**Syllabus/Topics:** ${syllabus}` : ""}
${goals ? `**Goals:** ${goals}` : ""}

Generate a detailed study roadmap with:

## 📊 Learning Profile Assessment
- Current level analysis
- Gap analysis (what needs to be learned)
- Estimated completion feasibility

## 🗺️ Phase-by-Phase Roadmap

### Phase 1: Foundation (Week 1-2)
[Topics, resources, hours, milestones]

### Phase 2: Core Concepts (Week 2-3)
[Topics, resources, hours, milestones]

### Phase 3: Advanced Topics (Week 3-4)
[Topics, resources, hours, milestones]

### Phase 4: Practice & Review (Final Week)
[Practice methods, mock tests, review strategy]

## 📅 Weekly Schedule Template
Day-by-day breakdown for one typical week

## 📚 Recommended Resources
- Best books/textbooks
- Online courses
- Practice websites
- YouTube channels

## ✅ Weekly Milestones & Progress Checkpoints
Specific, measurable goals for each week

## 💪 Daily Study Routine
Optimal study session structure using Pomodoro technique

## ⚠️ Common Pitfalls to Avoid
3-5 mistakes students make when studying this subject

Format everything clearly in markdown with emojis for visual appeal.`,
        },
      ],
      max_tokens: 3000,
    });

    const roadmap = response.choices[0]?.message?.content || "Failed to generate roadmap.";
    res.json({ roadmap, subject, daysAvailable, totalHours });
  } catch (error: unknown) {
    console.error("Roadmap error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate roadmap";
    res.status(500).json({ error: message });
  }
});

export default router;
