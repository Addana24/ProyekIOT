# replit.md

## Overview

This is a full-stack IoT sensor monitoring application built with React (Vite), Express, and PostgreSQL. The application monitors sensor data from an ESP8266 device via MQTT and provides a real-time dashboard for visualizing temperature readings and LED status. The system features a modern UI built with shadcn/ui components and real-time data updates through WebSocket connections.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Charts**: Recharts for data visualization
- **Real-time Updates**: WebSocket connection for live sensor data

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **MQTT Integration**: Native MQTT client for IoT device communication
- **WebSocket**: Built-in WebSocket server for real-time client updates
- **Session Management**: PostgreSQL-based session storage

### Database Schema
- **users**: User authentication table with username/password
- **sensor_readings**: IoT sensor data storage including DHT temperature, LM35 temperature, LED level, and timestamps
- Uses Drizzle ORM for type-safe database operations and migrations

## Key Components

### IoT Data Flow
1. ESP8266 device publishes sensor data to MQTT broker
2. Express server subscribes to MQTT topic and receives data
3. Data is validated using Zod schemas and stored in PostgreSQL
4. WebSocket broadcasts new data to connected clients
5. React dashboard updates charts and displays in real-time

### MQTT Service
- Connects to external MQTT broker (mqtt.revolusi-it.com)
- Handles sensor data from device G.231.22.0029
- Processes DHT11 temperature, LM35 temperature, and LED status
- Automatic reconnection and error handling

### Real-time Dashboard
- Live sensor data visualization with responsive charts
- Connection status indicators for MQTT and WebSocket
- Historical data queries with time range filtering
- Mobile-responsive design with collapsible sidebar

## Data Flow

1. **Sensor Collection**: ESP8266 reads DHT11, LM35 sensors and LED status
2. **MQTT Publishing**: Device publishes JSON data to MQTT topic
3. **Server Processing**: Express server receives MQTT messages, validates data, and stores in database
4. **Real-time Broadcasting**: WebSocket sends new data to connected dashboard clients
5. **Data Visualization**: React components update charts and display current readings
6. **Historical Analysis**: API endpoints provide access to historical sensor data

## External Dependencies

### Production Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe ORM for database operations
- **mqtt**: MQTT client for IoT device communication
- **ws**: WebSocket server implementation
- **@tanstack/react-query**: Server state management
- **recharts**: Chart library for data visualization
- **@radix-ui/***: Accessible UI component primitives
- **zod**: Runtime type validation

### Development Environment
- **Replit**: Cloud development environment with PostgreSQL module
- **Vite**: Fast build tool with HMR support
- **TypeScript**: Type safety across the entire stack

## Deployment Strategy

### Build Process
- Frontend: Vite builds React app to `dist/public`
- Backend: esbuild bundles Express server to `dist/index.js`
- Database: Drizzle migrations handle schema updates

### Environment Configuration
- **Development**: `npm run dev` starts both frontend and backend with hot reload
- **Production**: `npm run build` followed by `npm run start`
- **Database**: Automatic PostgreSQL provisioning in Replit environment

### Scaling Considerations
- Replit autoscale deployment target for automatic scaling
- WebSocket connections handled per instance
- Database connections pooled through Neon serverless

## Changelog

Changelog:
- June 17, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.
