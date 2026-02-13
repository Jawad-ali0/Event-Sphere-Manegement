# Event Sphere Management System

A comprehensive event management platform for organizing expos, managing exhibitors, attendees, and schedules with real-time analytics.

## Features

- **Expo Management**: Create, edit, and delete expo events with detailed information
- **Exhibitor Management**: Handle registrations, approvals, and booth assignments
- **Schedule Management**: Create and manage event schedules with sessions and speakers
- **Analytics Dashboard**: Real-time reports on attendance, booth traffic, and session popularity
- **Real-time Updates**: Socket.io integration for live notifications
- **Role-based Access**: Admin, Organizer, Exhibitor, and Attendee roles
- **Responsive UI**: Modern React frontend with Vite

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Socket.io
- **Frontend**: React, Vite, Axios
- **Authentication**: JWT with bcrypt
- **Email**: Nodemailer for notifications
- **Testing**: Jest, Supertest
- **Linting**: ESLint
- **CI/CD**: GitHub Actions

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/event-sphere-management.git
cd event-sphere-management
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up environment variables:

Create `.env` file in backend directory:
```env
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/eventsphere
JWT_SECRET=your-jwt-secret-key
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
```

5. Seed admin user:
```bash
npm run seed:admin
```

6. Start the backend:
```bash
npm start
```

7. Start the frontend (in new terminal):
```bash
cd ../frontend
npm run dev
```

8. Access the application at `http://localhost:5173`

### Default Admin Credentials

- Email: admin@gmail.com
- Password: admin123

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Expo Endpoints

- `GET /api/expos` - Get all expos
- `POST /api/expos` - Create expo (organizer/admin)
- `PUT /api/expos/:id` - Update expo
- `DELETE /api/expos/:id` - Delete expo

### Exhibitor Endpoints

- `POST /api/exhibitors/register` - Register as exhibitor
- `GET /api/exhibitors/expo/:expoId` - Get registrations for expo
- `PUT /api/exhibitors/:id/status` - Approve/reject registration
- `PUT /api/exhibitors/:id/assign-booth` - Assign booth

### Schedule Endpoints

- `POST /api/schedules` - Create schedule
- `POST /api/schedules/:id/sessions` - Add session
- `PUT /api/schedules/:id/sessions/:sessionId` - Update session
- `DELETE /api/schedules/:id/sessions/:sessionId` - Delete session

### Analytics Endpoints

- `GET /api/analytics/expo/:expoId/attendance` - Get attendance count
- `GET /api/analytics/expo/:expoId/session-popularity` - Get session popularity
- `GET /api/analytics/expo/:expoId/booth-traffic` - Get booth traffic

## Development

### Running Tests

```bash
cd backend
npm test
```

### Linting

```bash
cd backend
npm run lint

cd ../frontend
npm run lint
```

### Docker Setup

```bash
cd infra
docker-compose up --build
```

## Project Structure

```
event-sphere-management/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   ├── scripts/         # Utility scripts
│   ├── tests/           # Test files
│   └── server.js        # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API services
│   │   ├── context/     # React context
│   │   └── App.jsx      # Main app component
│   └── package.json
├── infra/               # Infrastructure files
├── .github/workflows/   # CI/CD pipelines
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

ISC License
