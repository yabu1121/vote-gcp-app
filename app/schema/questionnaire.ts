import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const questionnaires = pgTable('questionnaires', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  choices: text('choices').array().notNull(),
  choiceCounts: integer('choice_counts').array().notNull(),
})