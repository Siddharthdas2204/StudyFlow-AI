import { Router, type IRouter } from "express";
import { db, quizzesTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/quizzes", async (_req, res) => {
  try {
    const quizzes = await db.select().from(quizzesTable).orderBy(quizzesTable.createdAt);
    res.json(quizzes.map(formatQuiz));
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

router.post("/quizzes", async (req, res) => {
  try {
    const { noteId, title, score, total } = req.body;
    const [quiz] = await db
      .insert(quizzesTable)
      .values({ noteId, title, score, total })
      .returning();
    res.status(201).json(formatQuiz(quiz));
  } catch (e) {
    res.status(500).json({ error: "Failed to create quiz" });
  }
});

function formatQuiz(quiz: typeof quizzesTable.$inferSelect) {
  return {
    ...quiz,
    createdAt: quiz.createdAt.toISOString(),
  };
}

export default router;
