import { sql } from "drizzle-orm";
import { pgTable, text, serial, integer, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Export everything from auth models for Replit Auth
export * from "./models/auth";

export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  leader: text("leader").notNull(),
  schedule: text("schedule").notNull(),
  location: text("location").notNull(),
  capacity: integer("capacity"),
  imageUrl: text("image_url"),
  creatorId: varchar("creator_id"), // Link to user who created the group
});

export const joinRequests = pgTable("join_requests", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull(),
  userId: varchar("user_id").notNull(),
  email: text("email").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  createdAt: timestamp("created_at").defaultNow(),
});

// Update user roles - we'll handle this via a property or separate metadata if needed, 
// but for simplicity let's stick to a basic mapping in code or just check creatorId
// The user message mentions roles: "Circle Leader", "Participant", "Admin".
// Let's add role to the user table (we'll need to extend the blueprint's user table if possible,
// or just use creatorId for circle leader logic). 
// Replit Auth blueprint creates 'users' table in models/auth.ts. 
// I should extend the users table in models/auth.ts if I can, but since it's a blueprint
// I'll just check if they are the creator or have a specific email for Admin.

export const insertGroupSchema = createInsertSchema(groups).omit({ id: true });
export const insertJoinRequestSchema = createInsertSchema(joinRequests).omit({ id: true, createdAt: true });

export type Group = typeof groups.$inferSelect;
export type InsertGroup = z.infer<typeof insertGroupSchema>;
export type JoinRequest = typeof joinRequests.$inferSelect;
export type InsertJoinRequest = z.infer<typeof insertJoinRequestSchema>;

export type CreateGroupRequest = InsertGroup;
export type UpdateGroupRequest = Partial<InsertGroup>;
