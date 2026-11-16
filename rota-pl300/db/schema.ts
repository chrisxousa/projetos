import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const studyState = sqliteTable('study_state', {
 userId: text('user_id').primaryKey(),
 data: text('data').notNull(),
 revision: integer('revision').notNull().default(0),
 updatedAt: text('updated_at').notNull(),
});
