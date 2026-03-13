import { Router, type IRouter } from "express";
import { db, notesTable, flashcardsTable, quizzesTable } from "@workspace/db";
import { count, isNotNull, lte } from "drizzle-orm";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/progress", async (_req, res) => {
  try {
    const [notesResult] = await db.select({ count: count() }).from(notesTable);
    const [flashcardsResult] = await db.select({ count: count() }).from(flashcardsTable);
    const [studiedResult] = await db
      .select({ count: count() })
      .from(flashcardsTable)
      .where(isNotNull(flashcardsTable.lastReviewed));
    const [quizzesResult] = await db.select({ count: count() }).from(quizzesTable);

    const notesCount = notesResult?.count ?? 0;
    const totalFlashcards = flashcardsResult?.count ?? 0;
    const flashcardsStudied = studiedResult?.count ?? 0;
    const quizzesCompleted = quizzesResult?.count ?? 0;

    const studyStreak = notesCount > 0 ? Math.min(notesCount, 7) : 0;

    res.json({
      notesCount,
      flashcardsStudied,
      quizzesCompleted,
      studyStreak,
      totalFlashcards,
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});

export default router;
