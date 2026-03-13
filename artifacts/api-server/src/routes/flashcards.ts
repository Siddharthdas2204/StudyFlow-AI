import { Router, type IRouter } from "express";
import { db, flashcardsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/flashcards", async (req, res) => {
  try {
    const noteId = req.query.noteId ? parseInt(req.query.noteId as string) : undefined;
    let cards;
    if (noteId) {
      cards = await db.select().from(flashcardsTable).where(eq(flashcardsTable.noteId, noteId)).orderBy(flashcardsTable.createdAt);
    } else {
      cards = await db.select().from(flashcardsTable).orderBy(flashcardsTable.createdAt);
    }
    res.json(cards.map(formatCard));
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch flashcards" });
  }
});

router.post("/flashcards", async (req, res) => {
  try {
    const { noteId, question, answer } = req.body;
    const [card] = await db
      .insert(flashcardsTable)
      .values({ noteId, question, answer, difficulty: 0 })
      .returning();
    res.status(201).json(formatCard(card));
  } catch (e) {
    res.status(500).json({ error: "Failed to create flashcard" });
  }
});

router.patch("/flashcards/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { lastReviewed, nextReview, difficulty } = req.body;
    const updateData: Record<string, unknown> = {};
    if (lastReviewed !== undefined) updateData.lastReviewed = new Date(lastReviewed);
    if (nextReview !== undefined) updateData.nextReview = new Date(nextReview);
    if (difficulty !== undefined) updateData.difficulty = difficulty;

    const [card] = await db
      .update(flashcardsTable)
      .set(updateData)
      .where(eq(flashcardsTable.id, id))
      .returning();
    if (!card) return res.status(404).json({ error: "Flashcard not found" });
    res.json(formatCard(card));
  } catch (e) {
    res.status(500).json({ error: "Failed to update flashcard" });
  }
});

router.delete("/flashcards/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(flashcardsTable).where(eq(flashcardsTable.id, id));
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: "Failed to delete flashcard" });
  }
});

function formatCard(card: typeof flashcardsTable.$inferSelect) {
  return {
    ...card,
    lastReviewed: card.lastReviewed?.toISOString() ?? null,
    nextReview: card.nextReview?.toISOString() ?? null,
    createdAt: card.createdAt.toISOString(),
  };
}

export default router;
