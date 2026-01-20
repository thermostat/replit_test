import { db } from "./db";
import { groups, joinRequests, type Group, type InsertGroup, type UpdateGroupRequest, type JoinRequest, type InsertJoinRequest } from "@shared/schema";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getGroups(): Promise<Group[]>;
  getGroup(id: number): Promise<Group | undefined>;
  createGroup(group: InsertGroup): Promise<Group>;
  updateGroup(id: number, updates: UpdateGroupRequest): Promise<Group>;
  deleteGroup(id: number): Promise<void>;
  
  createJoinRequest(request: InsertJoinRequest): Promise<JoinRequest>;
  getJoinRequests(groupId: number): Promise<JoinRequest[]>;
}

export class DatabaseStorage implements IStorage {
  async getGroups(): Promise<Group[]> {
    return await db.select().from(groups);
  }

  async getGroup(id: number): Promise<Group | undefined> {
    const [group] = await db.select().from(groups).where(eq(groups.id, id));
    return group;
  }

  async createGroup(insertGroup: InsertGroup): Promise<Group> {
    const [group] = await db.insert(groups).values(insertGroup).returning();
    return group;
  }

  async updateGroup(id: number, updates: UpdateGroupRequest): Promise<Group> {
    const [updated] = await db.update(groups)
      .set(updates)
      .where(eq(groups.id, id))
      .returning();
    return updated;
  }

  async deleteGroup(id: number): Promise<void> {
    await db.delete(groups).where(eq(groups.id, id));
  }

  async createJoinRequest(request: InsertJoinRequest): Promise<JoinRequest> {
    const [jr] = await db.insert(joinRequests).values(request).returning();
    return jr;
  }

  async getJoinRequests(groupId: number): Promise<JoinRequest[]> {
    return await db.select().from(joinRequests).where(eq(joinRequests.groupId, groupId));
  }
}

export const storage = new DatabaseStorage();
