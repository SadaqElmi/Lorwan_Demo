# LoRaWAN ChirpStack Backend API

A NestJS-based backend API for handling LoRaWAN uplink messages from ChirpStack.

## Features

- **MQTT Integration**: Subscribes to ChirpStack MQTT topics for real-time uplink processing
- **MongoDB Storage**: Stores uplink messages with enhanced parsing and metadata
- **REST API**: Provides endpoints for querying uplinks, devices, and applications
- **Dynamic Payload Parsing**: Handles JSON, hex, base64, and raw payload formats
- **TypeScript**: Full TypeScript support with proper type definitions
- **Validation**: Request/response validation using class-validator

## API Endpoints

### General

- `GET /` - Health check
- `GET /test` - Server status

### Uplinks

- `GET /uplinks` - Get all uplinks with filtering options
- `GET /uplinks/device/:deviceId` - Get uplinks for a specific device
- `GET /uplinks/stats` - Get uplink statistics

### Devices

- `GET /devices` - Get all devices with statistics
- `POST /devices` - Create a test device

### Applications

- `GET /applications` - Get all applications with statistics

## Environment Variables

- `PORT` - Server port (default: 4000)
- `MONGODB_URL` - MongoDB connection string (default: mongodb://localhost:27017/lorawan)
- `MQTT_URL` - MQTT broker URL (default: mqtt://localhost:1883)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod
```

## Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Test API endpoints
node test-nestjs.js
```

## Architecture

The application follows NestJS modular architecture:

- **AppModule**: Main application module
- **DatabaseModule**: MongoDB connection and schemas
- **MqttModule**: MQTT client and message handling
- **UplinksModule**: Uplink data management
- **DevicesModule**: Device management
- **ApplicationsModule**: Application management

## Migration from Express.js

This NestJS application was converted from the original Express.js backend with the following improvements:

- Modular architecture with dependency injection
- TypeScript support with proper type definitions
- Built-in validation and transformation
- Better error handling and logging
- Enhanced code organization and maintainability
- Swagger documentation support (ready to add)
