import type { PageServerLoad, PageServerLoadEvent } from './$types';
import type { Project } from '$lib/server/db/schema';
import { projectOperations, projectOperations } from '$lib/server/db/projectOperations';

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