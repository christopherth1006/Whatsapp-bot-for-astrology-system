# WhatsApp-Based Astrology Automation Software

A Node.js backend system for automating astrology services via WhatsApp, integrating with WhatsApp Cloud API, Google Geocoding API, and Prokerala Astrology API.

## Features

- **WhatsApp Integration**: Receive and send messages via WhatsApp Cloud API
- **Location Handling**: Process user locations using Google Geocoding API
- **Astrology Data**: Fetch horoscope, panchang, and other astrology data from Prokerala API
- **Playlist Generation**: Automatically generate daily astrology playlists for users
- **Cron Jobs**: Automated daily playlist generation and sending
- **Admin Panel**: Admin APIs for managing users and playlists
- **User Management**: Complete user management system with location and birth details

## Project Structure

```
astrology_system/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── admin.controller.js   # Admin operations
│   ├── playlist.controller.js # Playlist operations
│   ├── user.controller.js    # User operations
│   └── whatsapp.controller.js # WhatsApp webhook handler
├── models/
│   ├── AstrologyData.model.js # Astrology data schema
│   ├── Location.model.js      # Location schema
│   ├── Playlist.model.js      # Playlist schema
│   └── User.model.js          # User schema
├── routes/
│   ├── admin.routes.js        # Admin API routes
│   ├── playlist.routes.js     # Playlist API routes
│   ├── user.routes.js         # User API routes
│   └── whatsapp.routes.js     # WhatsApp webhook routes
├── services/
│   ├── astrology.service.js   # Prokerala API integration
│   ├── cron.service.js        # Cron job management
│   ├── geocoding.service.js   # Google Geocoding API
│   ├── playlist.service.js     # Playlist generation logic
│   ├── user.service.js         # User operations
│   └── whatsapp.service.js     # WhatsApp API integration
├── utils/
│   └── logger.js              # Winston logger configuration
├── logs/                       # Application logs
├── .env                        # Environment variables (create from .env.example)
├── .gitignore
├── package.json
├── README.md
└── server.js                   # Main application entry point
```

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- WhatsApp Business Account with Cloud API access
- Google Cloud API key (for Geocoding)
- Prokerala API key (for Astrology data)

## Installation

1. Clone the repository:
```bash
cd astrology_system
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=3000
NODE_ENV=development

# PostgreSQL Database Configuration
DB_NAME=astrology_system
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432

# WhatsApp Cloud API
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_VERIFY_TOKEN=your_verify_token

# Google Geocoding API
GOOGLE_GEOCODING_API_KEY=your_google_api_key
GOOGLE_GEOCODING_API_URL=https://maps.googleapis.com/maps/api/geocode/json

# Prokerala Astrology API
PROKERALA_API_KEY=your_prokerala_api_key
PROKERALA_API_URL=https://api.prokerala.com/v2/astrology
```

5. Set up PostgreSQL database:
```bash
# Create database
createdb astrology_system

# Or using psql:
psql -U postgres
CREATE DATABASE astrology_system;
\q
```

6. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### WhatsApp Webhook
- `GET /api/whatsapp/webhook` - Webhook verification
- `POST /api/whatsapp/webhook` - Receive WhatsApp messages

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Playlists
- `GET /api/playlists/user/:userId` - Get playlists for a user
- `GET /api/playlists/:id` - Get playlist by ID
- `POST /api/playlists/generate` - Generate playlist for user
- `POST /api/playlists/:id/send` - Send playlist via WhatsApp

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user by ID
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/playlists` - Get all playlists
- `GET /api/admin/playlists/:id` - Get playlist by ID
- `POST /api/admin/playlists/generate` - Manually generate playlists
- `POST /api/admin/playlists/:id/send` - Manually send playlist

### Health Check
- `GET /health` - Server health check

## WhatsApp Integration

### Setting up WhatsApp Webhook

1. Configure your WhatsApp Cloud API credentials in `.env`
2. Set up webhook URL: `https://your-domain.com/api/whatsapp/webhook`
3. Set verify token in `.env` (WHATSAPP_VERIFY_TOKEN)
4. Facebook will verify the webhook using GET request
5. Incoming messages will be received via POST request

### Supported Message Types

- **Text Messages**: Process commands like "help", "horoscope", "location"
- **Location Messages**: Automatically geocode and save user location

## Cron Jobs

The system includes automated cron jobs:

- **Daily Playlist Generation**: Runs at 6 AM every day
- **Pending Playlist Sending**: Runs every hour

## Database Models

The application uses **PostgreSQL** with **Sequelize ORM**. Models are automatically synchronized in development mode.

### User
- UUID primary key
- Phone number (unique), name, location (JSONB), birth details (JSONB)
- Preferences and settings (JSONB)
- Activity status, admin flag
- Timestamps (createdAt, updatedAt)

### Location
- UUID primary key
- Foreign key to User
- Latitude, longitude (DECIMAL)
- Address details and timezone
- Primary location flag

### AstrologyData
- UUID primary key
- Foreign key to User
- Date, data type (ENUM: daily, weekly, monthly, horoscope, panchang)
- Data and raw response (JSONB)
- Unique index on (userId, date, dataType)

### Playlist
- UUID primary key
- Foreign key to User
- Date, playlist items (JSONB array)
- Status (ENUM: pending, processing, completed, failed)
- Unique index on (userId, date)

## Development

### Running in Development Mode
```bash
npm run dev
```

### Logs
Application logs are stored in the `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only

## Environment Variables

See `.env.example` for all required environment variables.

## Security Considerations

- Use environment variables for sensitive data
- Implement authentication for admin endpoints
- Validate and sanitize user inputs
- Use HTTPS in production
- Implement rate limiting

## License

ISC

## Support

For issues and questions, please refer to the project documentation or contact the development team.


