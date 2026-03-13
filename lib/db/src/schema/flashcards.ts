import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const flashcardsTable = pgTable("flashcards", {
  id: serial("id").primaryKey(),
  noteId: integer("note_id"),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  lastReviewed: timestamp("last_reviewed"),
  nextReview: timestamp("next_review"),
  difficulty: integer("difficulty").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFlashcardSchema = createInsertSchema(flashcardsTable).omit({ id: true, createdAt: true });
export type InsertFlashcard = z.infer<typeof insertFlashcardSchema>;
export type Flashcard = typeof flashcardsTable.$inferSelect;
