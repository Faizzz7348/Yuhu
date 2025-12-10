import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const routes = pgTable("routes", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export const machines = pgTable("machines", {
  id: varchar("id").primaryKey(),
  routeId: varchar("route_id"),
  location: text("location").notNull(),
  status: text("status").notNull(), // "operational", "needs_refill", "maintenance"
  lastRefill: timestamp("last_refill"),
  nextRefill: timestamp("next_refill"),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey(),
  machineId: varchar("machine_id").notNull(),
  name: text("name").notNull(),
  currentStock: integer("current_stock").notNull(),
  capacity: integer("capacity").notNull(),
});

export const refillRecords = pgTable("refill_records", {
  id: varchar("id").primaryKey(),
  machineId: varchar("machine_id").notNull(),
  date: timestamp("date").notNull(),
  technician: text("technician").notNull(),
  lorry: text("lorry"),
  notes: text("notes"),
});

export const insertRouteSchema = createInsertSchema(routes).omit({ id: true });
export const insertMachineSchema = createInsertSchema(machines).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertRefillRecordSchema = createInsertSchema(refillRecords).omit({ id: true });

export type Route = typeof routes.$inferSelect;
export type Machine = typeof machines.$inferSelect;
export type Product = typeof products.$inferSelect;
export type RefillRecord = typeof refillRecords.$inferSelect;
export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type InsertMachine = z.infer<typeof insertMachineSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertRefillRecord = z.infer<typeof insertRefillRecordSchema>;

// Remove the user table as it's not needed for this simulator
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
