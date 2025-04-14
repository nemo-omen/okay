import { redirect, type Actions } from "@sveltejs/kit";
import { userOperations } from "$lib/server/db/userOperations";
import { hashPassword } from "$lib/util/hash";
import type { PageServerLoad } from "./$types";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(255),
  username: z.string().min(3).max(31),
  confirmPassword: z.string()
    .min(6)
    .max(255),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    return redirect(302, '/home');
  }
  return {};
};

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const entries = Object.fromEntries(formData);

    // Validate the form data
    const isValid = registerSchema.safeParse(entries);
    if (!isValid.success) {
      return { error: isValid.error.format() };
    }

    const { email, password, username } = isValid.data;

    const userOps = userOperations();

    try {

      const user = await userOps.create({
        email,
        passwordHash: await hashPassword(password),
        username
      });

      if (!user) {
        return { error: 'User creation failed' };
      }
      console.log(`User created: ${username}`);

      console.log(`Email: ${email}, Password: ${password}`);
    } catch (error) {
      console.error('Error creating user:', error);
      return { error: 'User creation failed' };
    }
    return redirect(302, '/auth/login');
  }
};