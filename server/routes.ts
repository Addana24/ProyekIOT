import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { storage } from "./storage";
import { mqttService } from "./services/mqttService";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get recent sensor readings
  app.get("/api/sensor-readings/:deviceId", async (req, res) => {
    try {
      const { deviceId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      
      const readings = await storage.getRecentReadings(deviceId, limit);
      res.json(readings);
    } catch (error) {
      console.error("Error fetching sensor readings:", error);
      res.status(500).json({ error: "Failed to fetch sensor readings" });
    }
  });

  // Get sensor readings by time range
  app.get("/api/sensor-readings/:deviceId/range", async (req, res) => {
    try {
      const { deviceId } = req.params;
      const { startTime, endTime } = req.query;
      
      if (!startTime || !endTime) {
        return res.status(400).json({ error: "startTime and endTime are required" });
      }
      
      const readings = await storage.getReadingsByTimeRange(
        deviceId,
        new Date(startTime as string),
        new Date(endTime as string)
      );
      
      res.json(readings);
    } catch (error) {
      console.error("Error fetching sensor readings by range:", error);
      res.status(500).json({ error: "Failed to fetch sensor readings" });
    }
  });

  // Get MQTT connection status
  app.get("/api/mqtt/status", (req, res) => {
    res.json({ connected: mqttService.getConnectionStatus() });
  });

  const httpServer = createServer(app);

  // Setup WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  mqttService.setupWebSocketServer(wss);

  return httpServer;
}
