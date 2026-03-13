import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const studyPlansTable = pgTable("study_plans", {
  id: serial("id").primaryKey(),
  subjects: text("subjects").notNull(),
  examDate: text("exam_date").notNull(),
  planData: text("plan_data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStudyPlanSchema = createInsertSchema(studyPlansTable).omit({ id: true, createdAt: true });
export type InsertStudyPlan = z.infer<typeof insertStudyPlanSchema>;
export type StudyPlan = typeof studyPlansTable.$inferSelect;
