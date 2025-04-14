import type { RequestEvent } from "@sveltejs/kit";
import * as schema from '$lib/server/db/schema';

export type TrackedEntity = 'task' | 'list' | 'project';

export type TrackedAction = 'create' | 'update' | 'delete';

export type LogActionProps<T extends Record<string, any>> = {
  db: typeof import('$lib/server/db').db,
  entityType: TrackedEntity,
  entityId: string,
  actionType: TrackedAction,
  changes: Partial<T>,
  event: RequestEvent,
  batchId?: string;
};

export async function logAction<T extends Record<string, any>>(action: LogActionProps<T>) {
  const { db, entityType, entityId, actionType, changes, event, batchId } = action;
  if (!event.locals.user || !event.locals.session) {
    return;
  }
  const userId = event.locals.user.id;
  const sessionId = event.locals.session.id;

  const entries = Object.entries(changes).map(([columnName, newValue]) => ({
    userId,
    entityType,
    entityId,
    columnName,
    actionType,
    newValue: newValue ? JSON.stringify(newValue) : null,
    oldValue: null,
    clientInfo: event.request.headers.get('user-agent'),
    ipAddress: event.getClientAddress(),
    sessionId,
    batchId
  }));
  await db.insert(schema.actionHistory).values(entries);
}