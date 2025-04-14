import { db } from "$lib/server/db";
import { user } from "$lib/server/db/schema";
import { verify } from "@node-rs/argon2";
import { eq } from "drizzle-orm";

type NewUser = typeof user.$inferInsert;

export function userOperations() {
  return {
    getById: async (userId: string) => {
      const [userData] = await db.select().from(user).where(eq(user.id, userId));
      return userData;
    },
    getByEmail: async (email: string) => {
      const [userData] = await db.select().from(user).where(eq(user.email, email));
      return userData;
    },
    create: async (userData: NewUser) => {
      if (!userData.email || !userData.passwordHash || !userData.username) {
        throw new Error("Missing required fields");
      }
      const [newUser] = await db.insert(user).values({
        email: userData.email!,
        passwordHash: userData.passwordHash!,
        username: userData.username!,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      return newUser;
    },
    update: async (userId: string, changes: Partial<NewUser>) => {
      const [updatedUser] = await db.update(user)
        .set({ ...changes, updatedAt: new Date() })
        .where(eq(user.id, userId))
        .returning();
      return updatedUser;
    },
    delete: async (userId: string) => {
      await db.delete(user)
        .where(eq(user.id, userId));
    },
    verifyPassword: async (user: NewUser, password: string) => {
      const validPassword = await verify(user.passwordHash, password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
      });
      return validPassword;
    }
  };
}