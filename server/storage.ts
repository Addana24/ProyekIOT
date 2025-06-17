import { users, sensorReadings, type User, type InsertUser, type SensorReading, type InsertSensorReading } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Sensor reading operations
  createSensorReading(reading: InsertSensorReading): Promise<SensorReading>;
  getRecentReadings(deviceId: string, limit?: number): Promise<SensorReading[]>;
  getReadingsByTimeRange(deviceId: string, startTime: Date, endTime: Date): Promise<SensorReading[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private sensorReadings: Map<number, SensorReading>;
  private currentUserId: number;
  private currentReadingId: number;

  constructor() {
    this.users = new Map();
    this.sensorReadings = new Map();
    this.currentUserId = 1;
    this.currentReadingId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createSensorReading(insertReading: InsertSensorReading): Promise<SensorReading> {
    const id = this.currentReadingId++;
    const reading: SensorReading = {
      ...insertReading,
      id,
      timestamp: new Date(),
    };
    this.sensorReadings.set(id, reading);
    return reading;
  }

  async getRecentReadings(deviceId: string, limit: number = 50): Promise<SensorReading[]> {
    const readings = Array.from(this.sensorReadings.values())
      .filter(reading => reading.deviceId === deviceId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
    
    return readings;
  }

  async getReadingsByTimeRange(deviceId: string, startTime: Date, endTime: Date): Promise<SensorReading[]> {
    const readings = Array.from(this.sensorReadings.values())
      .filter(reading => 
        reading.deviceId === deviceId &&
        reading.timestamp >= startTime &&
        reading.timestamp <= endTime
      )
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    return readings;
  }
}

export const storage = new MemStorage();
