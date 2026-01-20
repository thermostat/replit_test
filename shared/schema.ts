import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  leader: text("leader").notNull(),
  schedule: text("schedule").notNull(),
  location: text("location").notNull(),
  capacity: integer("capacity"),
  imageUrl: text("image_url"), // Optional image for the group
});

export const insertGroupSchema = createInsertSchema(groups).omit({ id: true });

export type Group = typeof groups.$inferSelect;
export type InsertGroup = z.infer<typeof insertGroupSchema>;
export type CreateGroupRequest = InsertGroup;
export type UpdateGroupRequest = Partial<InsertGroup>;
