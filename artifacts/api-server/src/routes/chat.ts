import { Router, type IRouter } from "express";
import { db, chatMessagesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/chat", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const messages = await db
      .select()
      .from(chatMessagesTable)
      .where(eq(chatMessagesTable.userId, userId))
      .orderBy(chatMessagesTable.createdAt);
    res.json(messages.map(formatMessage));
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

router.post("/chat", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { role, content, subject } = req.body;
    const [msg] = await db
      .insert(chatMessagesTable)
      .values({ userId, role, content, subject })
      .returning();
    res.status(201).json(formatMessage(msg));
  } catch (e) {
    res.status(500).json({ error: "Failed to save message" });
  }
});

router.delete("/chat", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    await db.delete(chatMessagesTable).where(eq(chatMessagesTable.userId, userId));
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
