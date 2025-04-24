import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';
import type { Project } from '$lib/server/db/schema';
import { projectUpdateSchema } from '$lib/server/db/zodSchema';
import { projectOperations, projectOperations } from '$lib/server/db/projectOperations';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
  const { params, locals } = event;
  const { id } = params;

  try {
    const projectOps = projectOperations(event);
    const project: Project | null = await projectOps.getProjectById(id);
    if (!project) {
      throw new Error(`Project with id ${id} not found`);
    }

    return { project };
  } catch (error) {
    console.error('Error loading project:', error);
    throw error;
  }
};

export const actions = {
  update: async (event: RequestEvent) => {
    const { locals, request } = event;
    const formData = await request.formData();
    const projectEntries = Object.fromEntries(formData.entries());
    const createdAt = new Date(projectEntries.createdAt as string);
    const updatedAt = new Date(projectEntries.updatedAt as string);
    projectEntries.createdAt = createdAt;
    projectEntries.updatedAt = updatedAt;
    const validated = projectUpdateSchema.safeParse(projectEntries);
    console.log({ validated });

    if (!validated.success) {
      console.error('Validation failed:', validated.error.flatten());
      return fail(400, { errors: validated.error.flatten() });
    }

    const projectOps = projectOperations(event);
    const id = validated.data.id as string | undefined;
    if (!id) {
      return fail(400, { error: 'Invalid or missing project ID' });
    }

    try {
      const updateResult = await projectOps.update(id, validated.data as Project);
      // console.log('Project updated successfully:', updateResult);
      return { success: true, message: 'Project updated successfully', project: updateResult };
    } catch (error) {
      console.error('Error updating project:', error);
      return fail(500, { error: 'Failed to update project' });
    }
  }
} satisfies Actions;