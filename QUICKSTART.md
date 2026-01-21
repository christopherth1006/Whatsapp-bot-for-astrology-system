# Quick Start Guide

## Prerequisites Setup

### 1. PostgreSQL Installation
- Install PostgreSQL from https://www.postgresql.org/download/
- Start PostgreSQL service:
  ```bash
  # Windows
  net start postgresql-x64-14  # Adjust version number
  
  # Linux
  sudo systemctl start postgresql
  
  # Mac (using Homebrew)
  brew services start postgresql
  ```
- Create database:
  ```bash
  # Using psql
  psql -U postgres
  CREATE DATABASE astrology_system;
  \q
  
  # Or using createdb command
  createdb -U postgres astrology_system
  ```

### 2. Get API Keys

#### WhatsApp Cloud API
1. Go to https://developers.facebook.com/
2. Create a new app or use existing
3. Add WhatsApp product
4. Get Phone Number ID and Access Token
5. Set up webhook URL (use ngrok for local testing)

#### Google Geocoding API
1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable Geocoding API
4. Create API key
5. Restrict API key to Geocoding API

#### Prokerala Astrology API
1. Go to https://www.prokerala.com/
2. Sign up for API access
3. Get your API key from dashboard

## Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Create Environment File**
   Create a `.env` file in the root directory with:
   ```env
   PORT=3000
   NODE_ENV=development
   
   # PostgreSQL Database Configuration
   DB_NAME=astrology_system
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   DB_PORT=5432
   
   WHATSAPP_API_URL=https://graph.facebook.com/v18.0
   WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
   WHATSAPP_ACCESS_TOKEN=your_access_token
   WHATSAPP_VERIFY_TOKEN=your_custom_verify_token
   
   GOOGLE_GEOCODING_API_KEY=your_google_api_key
   GOOGLE_GEOCODING_API_URL=https://maps.googleapis.com/maps/api/geocode/json
   
   PROKERALA_API_KEY=your_prokerala_api_key
   PROKERALA_API_URL=https://api.prokerala.com/v2/astrology
   ```

3. **Start the Server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

4. **Verify Installation**
   ```bash
   curl http://localhost:3000/health
   ```
   Should return:
   ```json
   {
     "status": "OK",
     "message": "WhatsApp Astrology Automation API is running",
     "timestamp": "2024-01-01T00:00:00.000Z"
   }
   ```

## Testing WhatsApp Webhook Locally

1. **Install ngrok**
   ```bash
   npm install -g ngrok
   ```

2. **Start ngrok tunnel**
   ```bash
   ngrok http 3000
   ```

3. **Configure Webhook**
   - Copy the ngrok HTTPS URL (e.g., https://abc123.ngrok.io)
   - Go to Facebook Developer Console
   - Set webhook URL: `https://abc123.ngrok.io/api/whatsapp/webhook`
   - Set verify token: (same as WHATSAPP_VERIFY_TOKEN in .env)
   - Subscribe to `messages` events

4. **Test Webhook**
   - Send a message to your WhatsApp Business number
   - Check server logs for incoming messages

## Testing API Endpoints

### Create a User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1234567890",
    "name": "Test User"
  }'
```

### Generate Playlist
```bash
curl -X POST http://localhost:3000/api/playlists/generate \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID_HERE",
    "date": "2024-01-01"
  }'
```

### Get Dashboard Stats
```bash
curl http://localhost:3000/api/admin/dashboard
```

## Common Issues

### PostgreSQL Connection Error
- Ensure PostgreSQL is running
- Check DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT in .env
- Verify PostgreSQL port (default: 5432)
- Ensure database exists: `psql -U postgres -l` to list databases
- Check user permissions: `psql -U postgres -c "\du"` to list users

### WhatsApp API Errors
- Verify Phone Number ID and Access Token
- Check webhook URL is accessible
- Ensure verify token matches

### API Key Errors
- Verify all API keys are correct
- Check API quotas/limits
- Ensure APIs are enabled in respective dashboards

## Next Steps

1. Set up production environment variables
2. Configure HTTPS for webhook
3. Set up monitoring and logging
4. Implement authentication for admin endpoints
5. Add rate limiting
6. Set up CI/CD pipeline


