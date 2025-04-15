import { logAction } from '$lib/server/db/changeTracking';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';
import type { RequestEvent } from '@sveltejs/kit';

export function projectOperations(event: RequestEvent) {
  return {
    getUserProjects: async (userId: string) => {
      const projects = await db.select()
        .from(schema.projects)
        .leftJoin(schema.lists, eq(schema.lists.projectId, schema.projects.id))
        .leftJoin(schema.tasks, eq(schema.tasks.listId, schema.lists.id))
        .where(eq(schema.projects.userId, userId));
      return projects;
    },
    getProjectById: async (projectId: string) => {
      const project = await db.select()
        .from(schema.projects)
        .leftJoin(schema.lists, eq(schema.lists.projectId, schema.projects.id))
        .leftJoin(schema.tasks, eq(schema.tasks.listId, schema.lists.id))
        .where(eq(schema.projects.id, projectId))
        .limit(1);
      if (project.length === 0) {
        throw new Error('Project not found');
      }
      return project[0];
    },
    create: async (projectData: Partial<schema.Project>) => {
      if (!projectData.title || !projectData.userId || !event.locals.user?.id) {
        throw new Error('Missing required fields');
      }
      const [project] = await db.insert(schema.projects).values({
        title: projectData.title!,
        userId: event.locals.user.id,
        ...projectData
      }).returning();
      await logAction({
        db,
        entityType: 'project',
        entityId: project.id,
        actionType: 'create',
        changes: projectData,
        event
      });
      return project;
    },
    update: async (projectId: string, changes: Partial<schema.Project>) => {
      const [oldProject] = await db.select()
        .from(schema.projects)
        .where(eq(schema.projects.id, projectId));

      const [updatedProject] = await db.update(schema.projects)
        .set({ ...changes, updatedAt: new Date() })
        .where(eq(schema.projects.id, projectId))
        .returning();

      await logAction({
        db,
        entityType: 'project',
        entityId: projectId,
        actionType: 'update',
        changes: Object.fromEntries(
          Object.entries(changes).map(([key, newValue]) => [
            key,
            { old: oldProject[key as keyof schema.Project], new: newValue }
          ])
        ),
        event
      });
      return updatedProject;
    },
    delete: async (projectId: string) => {
      const [oldProject] = await db.select()
        .from(schema.projects)
        .where(eq(schema.projects.id, projectId));

      await db.delete(schema.projects)
        .where(eq(schema.projects.id, projectId));

      await logAction({
        db,
        entityType: 'project',
        entityId: projectId,
        actionType: 'delete',
        changes: oldProject,
        event
      });
    },
  };
}
