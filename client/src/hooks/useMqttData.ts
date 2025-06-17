import { useState, useEffect } from "react";
import { useWebSocket } from "./useWebSocket";

interface SensorData {
  dhtTemperature: number;
  lm35Temperature: number;
  ledLevel: number;
  timestamp: string;
  deviceId: string;
}

interface ChartData {
  labels: string[];
  dhtData: number[];
  lm35Data: number[];
  ledData: number[];
}

export function useMqttData() {
  const { isConnected, lastMessage, sendMessage } = useWebSocket();
  const [currentData, setCurrentData] = useState<SensorData | null>(null);
  const [historicalData, setHistoricalData] = useState<SensorData[]>([]);
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    dhtData: [],
    lm35Data: [],
    ledData: [],
  });
  const [mqttConnected, setMqttConnected] = useState(false);

  useEffect(() => {
    if (!lastMessage) return;

    switch (lastMessage.type) {
      case "sensor_data":
        const newData = lastMessage.data as SensorData;
        setCurrentData(newData);
        
        // Add to historical data
        setHistoricalData(prev => [newData, ...prev.slice(0, 99)]);
        
        // Update chart data
        setChartData(prev => {
          const newLabels = [...prev.labels, new Date(newData.timestamp).toLocaleTimeString()];
          const newDhtData = [...prev.dhtData, newData.dhtTemperature];
          const newLm35Data = [...prev.lm35Data, newData.lm35Temperature];
          const newLedData = [...prev.ledData, newData.ledLevel];

          // Keep only last 20 data points
          if (newLabels.length > 20) {
            newLabels.shift();
            newDhtData.shift();
            newLm35Data.shift();
            newLedData.shift();
          }

          return {
            labels: newLabels,
            dhtData: newDhtData,
            lm35Data: newLm35Data,
            ledData: newLedData,
          };
        });
        break;

      case "historical_data":
        const readings = lastMessage.data as SensorData[];
        setHistoricalData(readings);
        
        // Initialize chart with recent data
        if (readings.length > 0) {
          const recentReadings = readings.slice(0, 20).reverse();
          setChartData({
            labels: recentReadings.map(r => new Date(r.timestamp).toLocaleTimeString()),
            dhtData: recentReadings.map(r => r.dhtTemperature),
            lm35Data: recentReadings.map(r => r.lm35Temperature),
            ledData: recentReadings.map(r => r.ledLevel),
          });
          
          // Set current data to the most recent reading
          setCurrentData(readings[0]);
        }
        break;

      case "connection_status":
        setMqttConnected(lastMessage.connected || false);
        break;
    }
  }, [lastMessage]);

  const requestHistoricalData = (limit: number = 50) => {
    sendMessage({
      type: "get_historical_data",
      limit,
    });
  };

  return {
    currentData,
    historicalData,
    chartData,
    isWebSocketConnected: isConnected,
    isMqttConnected: mqttConnected,
    requestHistoricalData,
  };
}
