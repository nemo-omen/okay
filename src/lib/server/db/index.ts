import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';
import { seed } from 'drizzle-seed';
import { hashPassword } from '$lib/util/hash';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = postgres(env.DATABASE_URL);

export const db = drizzle(client, { schema });

async function main() {
  const users = await db.select().from(schema.user);
  if (users.length > 0) {
    console.log('Database already seeded');
    return;
  }
  const hashedPassword = (await hashPassword('Password123!'));
  await seed(db, schema).refine((f) => ({
    user: {
      columns: {
        id: f.uuid(),
        username: f.valuesFromArray({ values: ['Mister Tesuser'] }),
        email: f.valuesFromArray({ values: ['tast@test.com'] }),
        passwordHash: f.valuesFromArray({ values: [hashedPassword] }),
      },
      count: 1,
      with: {
        projects: 2,
        lists: 3,
        tasks: 10,
      },
    },
  }));
}

main();
