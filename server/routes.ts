import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
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

  app.post(api.groups.create.path, async (req, res) => {
    try {
      const input = api.groups.create.input.parse(req.body);
      const group = await storage.createGroup(input);
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

  app.put(api.groups.update.path, async (req, res) => {
    try {
      const input = api.groups.update.input.parse(req.body);
      const group = await storage.updateGroup(Number(req.params.id), input);
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }
      res.json(group);
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

  app.delete(api.groups.delete.path, async (req, res) => {
    await storage.deleteGroup(Number(req.params.id));
    res.status(204).send();
  });

  await seedDatabase();

  return httpServer;
}

// Seed function to populate database with example groups
export async function seedDatabase() {
  const existingGroups = await storage.getGroups();
  if (existingGroups.length === 0) {
    await storage.createGroup({
      name: "Tuesday Night Torah",
      description: "A weekly dive into the Parsha with lively discussion and coffee.",
      leader: "Rabbi Cohen",
      schedule: "Tuesdays at 7:00 PM",
      location: "Library (Room 3B)",
      capacity: 15,
    });
    await storage.createGroup({
      name: "Knitting for a Cause",
      description: "We knit hats and scarves for the local shelter. Beginners welcome!",
      leader: "Sarah Levy",
      schedule: "Sundays at 10:00 AM",
      location: "Social Hall",
      capacity: 20,
    });
    await storage.createGroup({
      name: "Young Professionals Dinner",
      description: "Monthly Shabbat dinners for members ages 22-35.",
      leader: "David Stein",
      schedule: "First Friday of the month",
      location: "Rotates among members' homes",
      capacity: 12,
    });
  }
}
