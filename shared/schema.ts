import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const sensorReadings = pgTable("sensor_readings", {
  id: serial("id").primaryKey(),
  deviceId: text("device_id").notNull(),
  dhtTemperature: real("dht_temperature").notNull(),
  lm35Temperature: real("lm35_temperature").notNull(),
  ledLevel: integer("led_level").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSensorReadingSchema = createInsertSchema(sensorReadings).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type SensorReading = typeof sensorReadings.$inferSelect;
export type InsertSensorReading = z.infer<typeof insertSensorReadingSchema>;

// MQTT Data Schema
export const mqttDataSchema = z.object({
  suhuDHT: z.number(),
  suhuLM35: z.number(),
  LED: z.number().min(0).max(3),
});

export type MqttData = z.infer<typeof mqttDataSchema>;
