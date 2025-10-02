# Authentication Setup Guide

This guide will help you set up Keycloak authentication for the LoRaWAN ChirpStack Backend.

## Prerequisites

- Docker and Docker Compose installed
- The project running via `docker-compose up -d`

## Step 1: Access Keycloak Admin Console

1. Start the services: `docker-compose up -d`
2. Wait for Keycloak to start (check logs: `docker-compose logs keycloak`)
3. Access Keycloak at: http://localhost:9090
4. Login with admin credentials:
   - Username: `admin`
   - Password: `admin`

## Step 2: Create LoRaWAN Realm

1. Click on the dropdown next to "Master" (top-left)
2. Click "Create Realm"
3. Enter realm name: `lorawan`
4. Click "Create"

## Step 3: Create Backend Client

1. In the lorawan realm, go to "Clients"
2. Click "Create client"
3. Fill in:
   - Client ID: `lorawan-backend`
   - Client type: `OpenID Connect`
   - Click "Next"
4. Configure capabilities:
   - Client authentication: `ON`
   - Authorization: `OFF`
   - Authentication flow: Enable "Standard flow" and "Direct access grants"
   - Click "Next"
5. Login settings:
   - Valid redirect URIs: `http://localhost:3000/*`
   - Web origins: `http://localhost:3000`
   - Click "Save"

## Step 4: Get Client Secret

1. Go to "Clients" → "lorawan-backend"
2. Go to "Credentials" tab
3. Copy the "Client secret"
4. Update your environment variables:
   ```
   KEYCLOAK_CLIENT_SECRET=your-copied-secret
   ```

## Step 5: Create Frontend Client

1. Go to "Clients" → "Create client"
2. Fill in:
   - Client ID: `lorawan-frontend`
   - Client type: `OpenID Connect`
   - Click "Next"
3. Configure capabilities:
   - Client authentication: `OFF` (public client)
   - Authorization: `OFF`
   - Authentication flow: Enable "Standard flow"
   - Click "Next"
4. Login settings:
   - Valid redirect URIs: `http://localhost:3002/*`
   - Web origins: `http://localhost:3002`
   - Click "Save"

## Step 6: Create Users and Roles

### Create Roles:

1. Go to "Realm roles"
2. Click "Create role"
3. Create these roles:
   - `admin` - Full system access
   - `user` - Limited access to assigned organizations

### Create Users:

1. Go to "Users" → "Create new user"
2. Fill in user details:
   - Username: `admin`
   - Email: `admin@example.com`
   - First name: `Admin`
   - Last name: `User`
   - Click "Create"
3. Set password:
   - Go to "Credentials" tab
   - Click "Set password"
   - Enter password and set "Temporary" to OFF
4. Assign roles:
   - Go to "Role mapping" tab
   - Click "Assign role"
   - Select "admin" role

## Step 7: Test Authentication

1. Restart the backend service: `docker-compose restart backend`
2. Test the auth endpoint:
   ```bash
   curl http://localhost:3000/api/auth/profile
   # Should return 401 Unauthorized
   ```
3. Get a token from Keycloak and test with authorization header

## Environment Variables Reference

```env
# Keycloak Configuration
KEYCLOAK_AUTH_SERVER_URL=http://localhost:9090
KEYCLOAK_REALM=lorawan
KEYCLOAK_CLIENT_ID=lorawan-backend
KEYCLOAK_CLIENT_SECRET=your-client-secret

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
```

## API Endpoints

### Authentication Endpoints

- `GET /api/auth/profile` - Get current user profile
- `GET /api/auth/check-access/:organizationId` - Check organization access
- `POST /api/auth/users/:userId/organizations` - Assign user to organizations (admin only)

### Protected Endpoints

All existing API endpoints now require authentication:

- `GET/POST/PUT/DELETE /api/organizations/*`
- `GET/POST/PUT/DELETE /api/applications/*`
- `GET/POST/PUT/DELETE /api/devices/*`

## User-Organization Relationships

- **Admin users**: Have access to all organizations
- **Regular users**: Only have access to organizations they're explicitly assigned to
- **Organization assignment**: Done via the auth API by admin users

## Frontend Integration

The frontend needs to be updated to:

1. Integrate with Keycloak for login/logout
2. Store and send JWT tokens with API requests
3. Handle authentication redirects
4. Show appropriate UI based on user permissions

This completes the backend authentication setup. The system now has:
✅ User authentication via Keycloak
✅ JWT token validation
✅ Role-based access control
✅ Organization-level permissions
✅ Protected API endpoints
