import type { PageServerLoadEvent } from "./$types";
import type { PageServerData } from "./demo/lucia/login/$types";

export const load: PageServerData = async (event: PageServerLoadEvent) => {
  return {
    user: event.locals.user,
    session: event.locals.session,
  };
};