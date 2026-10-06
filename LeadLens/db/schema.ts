import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
export const leads = sqliteTable('leads', {
 id: text('id').primaryKey(), dedupKey: text('dedup_key').notNull(), company: text('company').notNull(), website: text('website').notNull(), industry: text('industry').notNull(), city: text('city').notNull(), country: text('country').notNull(), employees: integer('employees'), email: text('email').notNull(), source: text('source').notNull(), createdAt: text('created_at').notNull()
}, t => [uniqueIndex('idx_leads_dedup_key').on(t.dedupKey)]);
