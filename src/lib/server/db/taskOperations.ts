import { logAction } from '$lib/server/db/changeTracking';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';
import type { RequestEvent } from '@sveltejs/kit';

export function trackedTaskOperations(event: RequestEvent) {
  return {
    create: async (taskData: Partial<schema.Task>) => {
      if (!taskData.title || !taskData.description || !taskData.listId || !event.locals.user?.id) {
        throw new Error('Missing required fields');
      }
      const [task] = await db.insert(schema.tasks).values({
        title: taskData.title!,
        description: taskData.description!,
        userId: event.locals.user?.id,
        listId: taskData.listId!,
        ...taskData
      }).returning();
      await logAction({
        db,
        entityType: 'task',
        entityId: task.id,
        actionType: 'create',
        changes: taskData,
        event
      });
      return task;
    },
    update: async (taskId: string, changes: Partial<schema.Task>) => {
      const [oldTask] = await db.select()
        .from(schema.tasks)
        .where(eq(schema.tasks.id, taskId));

      const [updatedTask] = await db.update(schema.tasks)
        .set({ ...changes, updatedAt: new Date() })
        .where(eq(schema.tasks.id, taskId))
        .returning();

      await logAction({
        db,
        entityType: 'task',
        entityId: taskId,
        actionType: 'update',
        changes: Object.fromEntries(
          Object.entries(changes).map(([key, newValue]) => [
            key,
            { old: oldTask[key as keyof schema.Task], new: newValue }
          ])
        ),
        event
      });
      return updatedTask;
    },
    delete: async (taskId: string) => {
      const [oldTask] = await db.select()
        .from(schema.tasks)
        .where(eq(schema.tasks.id, taskId));

      await db.delete(schema.tasks)
        .where(eq(schema.tasks.id, taskId));

      await logAction({
        db,
        entityType: 'task',
        entityId: taskId,
        actionType: 'delete',
        changes: oldTask,
        event
      });
    },
    moveToList: async (taskId: string, listId: string) => {
      const batchId = crypto.randomUUID();

      const [task] = await db.select()
        .from(schema.tasks)
        .where(eq(schema.tasks.id, taskId));

      const [updatedTask] = await db.update(schema.tasks)
        .set({ listId, updatedAt: new Date() })
        .where(eq(schema.tasks.id, taskId))
        .returning();

      await logAction({
        db,
        entityType: 'task',
        entityId: taskId,
        actionType: 'update',
        changes: { listId: { old: task.listId, new: listId } },
        event,
        batchId
      });
      return updatedTask;
    }
  };
}
