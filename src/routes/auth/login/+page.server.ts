import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../register/$types";
import { z } from "zod";
import { userOperations } from "$lib/server/db/userOperations";
import * as auth from '$lib/server/auth';

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    return redirect(302, '/home');
  }
  return {};
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(255),
});

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const entries = Object.fromEntries(formData);

    const validationResult = loginSchema.safeParse(entries);
    if (!validationResult.success) {
      return { errors: validationResult.error.errors };
    }

    const { email, password } = validationResult.data;
    const userOps = userOperations();

    const user = await userOps.getByEmail(email);
    if (!user) {
      return { errors: [{ message: 'Invalid email or password' }] };
    }

    const isPasswordValid = await userOps.verifyPassword(user, password);
    if (!isPasswordValid) {
      return { errors: [{ message: 'Invalid email or password' }] };
    }

    const sessionToken = auth.generateSessionToken();
    const session = await auth.createSession(sessionToken, user.id);
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

    return redirect(302, '/home');
  }
};