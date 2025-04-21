import * as schema from './schema';
import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-zod';

export const projectInsertSchema = createInsertSchema(schema.projects);
export const projectUpdateSchema = createUpdateSchema(schema.projects);
export const projectSelectSchema = createSelectSchema(schema.projects);