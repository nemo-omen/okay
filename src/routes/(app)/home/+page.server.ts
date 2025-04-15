import type { PageServerLoad } from "./$types";
import { projectOperations } from "$lib/server/db/projectOperations";

export const load: PageServerLoad = async (event) => {
  const { user, session } = await event.parent();
  const projects = await projectOperations(event).getUserProjects(user.id);
  return {
    user,
    session,
    projects
  };
};