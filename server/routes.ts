import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth BEFORE other routes
  await setupAuth(app);
  registerAuthRoutes(app);
  
  app.get(api.groups.list.path, async (req, res) => {
    const groups = await storage.getGroups();
    res.json(groups);
  });

  app.get(api.groups.get.path, async (req, res) => {
    const group = await storage.getGroup(Number(req.params.id));
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.json(group);
  });

  // Protect creation - only for leaders/admins
  // For simplicity in this demo, we'll allow any authenticated user to be a leader
  app.post(api.groups.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.groups.create.input.parse(req.body);
      // Attach creator ID
      const group = await storage.createGroup({
        ...input,
        creatorId: req.user.claims.sub
      });
      res.status(201).json(group);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.groups.update.path, isAuthenticated, async (req: any, res) => {
    try {
      const group = await storage.getGroup(Number(req.params.id));
      if (!group) return res.status(404).json({ message: 'Group not found' });
      
      // Check if user is creator
      if (group.creatorId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Only the creator can edit this group" });
      }

      const input = api.groups.update.input.parse(req.body);
      const updated = await storage.updateGroup(Number(req.params.id), input);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.groups.delete.path, isAuthenticated, async (req: any, res) => {
    const group = await storage.getGroup(Number(req.params.id));
    if (!group) return res.status(404).json({ message: 'Group not found' });
    
    if (group.creatorId !== req.user.claims.sub) {
      return res.status(403).json({ message: "Only the creator can delete this group" });
    }

    await storage.deleteGroup(Number(req.params.id));
    res.status(204).send();
  });

  // Join Requests
  app.post(api.groups.requestJoin.path, isAuthenticated, async (req: any, res) => {
    const group = await storage.getGroup(Number(req.params.id));
    if (!group) return res.status(404).json({ message: 'Group not found' });

    try {
      const input = api.groups.requestJoin.input.parse(req.body);
      const request = await storage.createJoinRequest({
        groupId: group.id,
        userId: req.user.claims.sub,
        email: input.email,
        status: "pending"
      });
      res.status(201).json(request);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.groups.listRequests.path, isAuthenticated, async (req: any, res) => {
    const group = await storage.getGroup(Number(req.params.id));
    if (!group) return res.status(404).json({ message: 'Group not found' });

    // Only creator can see requests
    if (group.creatorId !== req.user.claims.sub) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const requests = await storage.getJoinRequests(group.id);
    res.json(requests);
  });

  return httpServer;
}

export async function seedDatabase() {
  const existingGroups = await storage.getGroups();
  if (existingGroups.length === 0) {
    // Note: Seed groups won't have creatorId links to real users unless specified
    await storage.createGroup({
      name: "Tuesday Night Torah",
      description: "A weekly dive into the Parsha with lively discussion and coffee.",
      leader: "Rabbi Cohen",
      schedule: "Tuesdays at 7:00 PM",
      location: "Library (Room 3B)",
      capacity: 15,
    });
  }
}
