ALTER TABLE "list" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "list" ADD COLUMN "icon" text;--> statement-breakpoint
ALTER TABLE "list" ADD COLUMN "color" text;--> statement-breakpoint
ALTER TABLE "list" ADD COLUMN "priority" text DEFAULT 'medium' NOT NULL;--> statement-breakpoint
ALTER TABLE "list" ADD COLUMN "status" text DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "list" ADD COLUMN "depends_on" uuid;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "icon" text;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "color" text;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "repeats" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "repeats_every" interval;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "priority" text DEFAULT 'medium' NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "depends_on" uuid;