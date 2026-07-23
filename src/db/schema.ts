import { relations, sql } from 'drizzle-orm'
import {
  boolean,
  check,
  date,
  index,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const transactionTypeEnum = pgEnum('transaction_type', ['income', 'expense'])
export const recurrenceEnum = pgEnum('recurrence', ['once', 'weekly', 'biweekly', 'monthly', 'yearly'])

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 320 }).notNull(),
    passwordHash: text('password_hash').notNull(),
    displayName: varchar('display_name', { length: 120 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex('users_email_idx').on(table.email)]
)

export const topics = pgTable(
  'topics',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 120 }).notNull(),
    description: text('description').notNull().default(''),
    color: varchar('color', { length: 32 }).notNull().default('#3b82f6'),
    isDefault: boolean('is_default').notNull().default(false),
    isActiveInForecast: boolean('is_active_in_forecast').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('topics_user_created_idx').on(table.userId, table.createdAt),
    check('topics_name_not_blank', sql`char_length(trim(${table.name})) > 0`),
  ]
)

export const transactions = pgTable(
  'transactions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    topicId: uuid('topic_id')
      .notNull()
      .references(() => topics.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: transactionTypeEnum('type').notNull(),
    amount: numeric('amount', { precision: 12, scale: 2, mode: 'number' }).notNull(),
    description: varchar('description', { length: 255 }).notNull(),
    category: varchar('category', { length: 100 }).notNull().default('General'),
    date: date('date').notNull(),
    recurrence: recurrenceEnum('recurrence').notNull().default('once'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('transactions_topic_date_idx').on(table.topicId, table.date),
    index('transactions_user_date_idx').on(table.userId, table.date),
    check('transactions_amount_positive', sql`${table.amount} > 0`),
    check('transactions_description_not_blank', sql`char_length(trim(${table.description})) > 0`),
  ]
)

export const usersRelations = relations(users, ({ many }) => ({
  topics: many(topics),
  transactions: many(transactions),
}))

export const topicsRelations = relations(topics, ({ one, many }) => ({
  user: one(users, {
    fields: [topics.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}))

export const transactionsRelations = relations(transactions, ({ one }) => ({
  topic: one(topics, {
    fields: [transactions.topicId],
    references: [topics.id],
  }),
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}))

export type DbUser = typeof users.$inferSelect
export type NewDbUser = typeof users.$inferInsert
export type DbTopic = typeof topics.$inferSelect
export type NewDbTopic = typeof topics.$inferInsert
export type DbTransaction = typeof transactions.$inferSelect
export type NewDbTransaction = typeof transactions.$inferInsert
