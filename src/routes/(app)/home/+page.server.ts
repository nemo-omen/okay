import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const { parent, locals } = event;
  const { user, session } = locals;
  const { projects } = await parent();

  return {
    user,
    session,
    projects
  };
};