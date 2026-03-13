import { Router, type IRouter } from "express";
import { db, chatMessagesTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/chat", async (_req, res) => {
  try {
    const messages = await db.select().from(chatMessagesTable).orderBy(chatMessagesTable.createdAt);
    res.json(messages.map(formatMessage));
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

router.post("/chat", async (req, res) => {
  try {
    const { role, content, subject } = req.body;
    const [msg] = await db
      .insert(chatMessagesTable)
      .values({ role, content, subject })
      .returning();
    res.status(201).json(formatMessage(msg));
  } catch (e) {
    res.status(500).json({ error: "Failed to save message" });
  }
});

router.delete("/chat", async (_req, res) => {
  try {
    await db.delete(chatMessagesTable);
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: "Failed to clear chat history" });
  }
});

function formatMessage(msg: typeof chatMessagesTable.$inferSelect) {
  return {
    ...msg,
    createdAt: msg.createdAt.toISOString(),
  };
}

export default router;
