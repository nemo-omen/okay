import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) {
    return redirect(302, '/auth/login');
  }

  return {
    user: event.locals.user,
    session: event.locals.session
  };
};