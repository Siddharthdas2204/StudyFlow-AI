import { Router, type IRouter } from "express";
import { db, notesTable } from "@workspace/db";
import { eq, like, or } from "drizzle-orm";

const router: IRouter = Router();

router.get("/notes", async (req, res) => {
  try {
    const search = req.query.search as string | undefined;
    let notes;
    if (search) {
      notes = await db
        .select()
        .from(notesTable)
        .where(
          or(
            like(notesTable.title, `%${search}%`),
            like(notesTable.content, `%${search}%`),
            like(notesTable.tags, `%${search}%`)
          )
        )
        .orderBy(notesTable.updatedAt);
    } else {
      notes = await db.select().from(notesTable).orderBy(notesTable.updatedAt);
    }
    res.json(notes.map(formatNote));
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

router.post("/notes", async (req, res) => {
  try {
    const { title, content, tags, tldr, keyConcepts } = req.body;
    const [note] = await db
      .insert(notesTable)
      .values({ title, content: content ?? "", tags: tags ?? "", tldr, keyConcepts })
      .returning();
    res.status(201).json(formatNote(note));
  } catch (e) {
    res.status(500).json({ error: "Failed to create note" });
  }
});

router.get("/notes/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [note] = await db.select().from(notesTable).where(eq(notesTable.id, id));
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(formatNote(note));
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch note" });
  }
});

router.patch("/notes/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, content, tags, tldr, keyConcepts } = req.body;
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (tags !== undefined) updateData.tags = tags;
    if (tldr !== undefined) updateData.tldr = tldr;
    if (keyConcepts !== undefined) updateData.keyConcepts = keyConcepts;

    const [note] = await db
      .update(notesTable)
      .set(updateData)
      .where(eq(notesTable.id, id))
      .returning();
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(formatNote(note));
  } catch (e) {
    res.status(500).json({ error: "Failed to update note" });
  }
});

router.delete("/notes/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(notesTable).where(eq(notesTable.id, id));
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: "Failed to delete note" });
  }
});

function formatNote(note: typeof notesTable.$inferSelect) {
  return {
    ...note,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  };
}

export default router;
