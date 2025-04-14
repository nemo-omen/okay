import { relations, sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
	username: text('username').notNull().unique(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull()
		.default(sql`now()`),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull()
		.default(sql`now()`)
});

export const userRelations = relations(user, ({ many }) => ({
	lists: many(lists),
	projects: many(projects),
	tasks: many(tasks)
}));

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const tasks = pgTable('task', {
	id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
	listId: uuid('list_id')
		.notNull()
		.references(() => lists.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	description: text('description').notNull(),
	userId: uuid('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull()
		.default(sql`now()`),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull()
		.default(sql`now()`),
	scheduledStartTime: timestamp('scheduled_start_time', { withTimezone: true, mode: 'date' }),
	scheduledEndTime: timestamp('scheduled_end_time', { withTimezone: true, mode: 'date' }),
	startedAt: timestamp('started_at', { withTimezone: true, mode: 'date' }),
	completedAt: timestamp('completed_at', { withTimezone: true, mode: 'date' })
});

export const taskRelations = relations(tasks, ({ one }) => ({
	user: one(user, {
		fields: [tasks.userId],
		references: [user.id]
	}),
	list: one(lists, {
		fields: [tasks.listId],
		references: [lists.id]
	})
}));

export const lists = pgTable('list', {
	id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
	title: text('title').notNull(),
	userId: uuid('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull()
		.default(sql`now()`),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull()
		.default(sql`now()`),
	scheduledStartTime: timestamp('scheduled_start_time', { withTimezone: true, mode: 'date' }),
	scheduledEndTime: timestamp('scheduled_end_time', { withTimezone: true, mode: 'date' }),
	startedAt: timestamp('started_at', { withTimezone: true, mode: 'date' }),
	completedAt: timestamp('completed_at', { withTimezone: true, mode: 'date' }),
	projectId: uuid('project_id')
		.references(() => projects.id, { onDelete: 'cascade' })
});

export const listRelations = relations(lists, ({ one, many }) => ({
	tasks: many(tasks),
	project: one(projects, {
		fields: [lists.projectId],
		references: [projects.id]
	}),
	user: one(user, {
		fields: [lists.userId],
		references: [user.id]
	})
}));

export const projects = pgTable('project', {
	id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
	title: text('title').notNull(),
	userId: uuid('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull()
		.default(sql`now()`),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull()
		.default(sql`now()`),
	scheduledStartTime: timestamp('scheduled_start_time', { withTimezone: true, mode: 'date' }),
	scheduledEndTime: timestamp('scheduled_end_time', { withTimezone: true, mode: 'date' }),
	startedAt: timestamp('started_at', { withTimezone: true, mode: 'date' }),
	completedAt: timestamp('completed_at', { withTimezone: true, mode: 'date' })
});

export const projectRelations = relations(projects, ({ one, many }) => ({
	lists: many(lists),
	user: one(user, {
		fields: [projects.userId],
		references: [user.id]
	})
}));

export const actionHistory = pgTable('action_history', {
	id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
	// Who made the change
	userId: uuid('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),

	// What was changed
	entityType: text('entity_type').notNull(), // 'task', 'list', 'project'
	entityId: uuid('entity_id').notNull(),
	columnName: text('column_name').notNull(),

	// How it was changed
	actionType: text('action_type').notNull(), // 'create', 'update', 'delete'
	oldValue: text('old_value'),
	newValue: text('new_value'),

	// Additional context
	clientInfo: text('client_info'), // browser, device, etc.
	ipAddress: text('ip_address'),
	sessionId: text('session_id').references(() => session.id),

	// For grouping related changes
	batchId: uuid('batch_id'), // group multiple changes that are part of one operation

	// When it happened
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
		.notNull()
		.default(sql`now()`)
});

export const actionHistoryRelations = relations(actionHistory, ({ one }) => ({
	user: one(user, {
		fields: [actionHistory.userId],
		references: [user.id]
	}),
	session: one(session, {
		fields: [actionHistory.sessionId],
		references: [session.id]
	})
}));

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type Task = typeof tasks.$inferSelect;

export type List = typeof lists.$inferSelect;

export type Project = typeof projects.$inferSelect;

export type ActionHistory = typeof actionHistory.$inferSelect;
