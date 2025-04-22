import { projectOperations } from "$lib/server/db/projectOperations";
import { projectUpdateSchema } from "$lib/server/db/zodSchema";

export const actions = {
  update: async (event: RequestEvent) => {
    const { locals, request } = event;
    const formData = await request.formData();
    const projectEntries = Object.fromEntries(formData.entries());
    projectEntries.createdAt = new Date(projectEntries.createdAt as string);
    projectEntries.updatedAt = new Date(projectEntries.updatedAt as string);
    const validated = projectUpdateSchema.safeParse(projectEntries);

    if (!validated.success) {
      console.error('Validation failed:', validated.error.flatten());
      return { status: 400, body: { errors: validated.error.flatten() } };
    }

    const projectOps = projectOperations(event);
    const id = projectEntries.id as string | undefined;
    if (!id) {
      return { status: 400, body: { error: 'Invalid or missing project ID' } };
    }

    try {
      const updateResult = await projectOps.update(id, validated.data);
      console.log('Project updated successfully:', updateResult);
      return { type: 'success', message: 'Project updated successfully', project: updateResult };
    } catch (error) {
      console.error('Error updating project:', error);
      return { status: 500, body: { error: 'Failed to update project' } };
    }
  }
};