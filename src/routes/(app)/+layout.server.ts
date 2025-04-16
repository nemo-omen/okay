import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { projectOperations } from "$lib/server/db/projectOperations";

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) {
    return redirect(302, '/auth/login');
  }

  const { user } = event.locals;

  const projects = await projectOperations(event).getUserProjects(user.id);

  return {
    user: event.locals.user,
    session: event.locals.session,
    projects
  };
};