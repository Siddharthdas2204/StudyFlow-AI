import { Router, type IRouter } from "express";
import { db, studyPlansTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/studyplans", async (_req, res) => {
  try {
    const plans = await db.select().from(studyPlansTable).orderBy(studyPlansTable.createdAt);
    res.json(plans.map(formatPlan));
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch study plans" });
  }
});

router.post("/studyplans", async (req, res) => {
  try {
    const { subjects, examDate, planData } = req.body;
    const [plan] = await db
      .insert(studyPlansTable)
      .values({ subjects, examDate, planData })
      .returning();
    res.status(201).json(formatPlan(plan));
  } catch (e) {
    res.status(500).json({ error: "Failed to create study plan" });
  }
});

router.delete("/studyplans/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(studyPlansTable).where(eq(studyPlansTable.id, id));
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: "Failed to delete study plan" });
  }
});

function formatPlan(plan: typeof studyPlansTable.$inferSelect) {
  return {
    ...plan,
    createdAt: plan.createdAt.toISOString(),
  };
}

export default router;
