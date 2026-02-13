const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const winston = require('winston');
const connectDB = require('./config/db');
const User = require('./models/User');
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const eventRoutes = require('./routes/events');

// Load environment variables
dotenv.config();

// Configure Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'event-sphere-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// Create default admin user if not exists
const createDefaultAdmin = async () => {
  try {
    const adminEmail = 'admin@gmail.com';

    const existingAdmin = await User.findOne({ email: adminEmail }).select('+password');

    if (!existingAdmin) {
      await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: adminEmail,
        password: 'admin123', // Will be hashed by pre-save hook
        role: 'admin',
      });

      if (process.env.NODE_ENV !== 'test') {
        console.log('✅ Default admin user created:');
        console.log('   Email: admin@gmail.com');
        console.log('   Password: admin123');
      }
    } else {
      // Check if password needs to be re-hashed (in case it was inserted directly)
      const bcrypt = require('bcryptjs');
      const isPasswordHashed = existingAdmin.password && (existingAdmin.password.startsWith('$2a$') || existingAdmin.password.startsWith('$2b$'));

      if (!isPasswordHashed) {
        // Password is not hashed, re-hash it
        const salt = await bcrypt.genSalt(10);
        existingAdmin.password = await bcrypt.hash('admin123', salt);
        await existingAdmin.save({ validateBeforeSave: false });
        if (process.env.NODE_ENV !== 'test') console.log('✅ Admin password has been re-hashed');
      } else {
        // Verify password works, if not, reset it
        try {
          const isMatch = await existingAdmin.comparePassword('admin123');
          if (!isMatch) {
            // Password doesn't match, reset it
            existingAdmin.password = 'admin123'; // Will be hashed by pre-save hook
            await existingAdmin.save();
            if (process.env.NODE_ENV !== 'test') console.log('✅ Admin password has been reset and re-hashed');
          } else {
            if (process.env.NODE_ENV !== 'test') console.log('✅ Default admin user already exists with correct password');
          }
        } catch (compareError) {
          // If compare fails, reset password
          if (process.env.NODE_ENV !== 'test') console.log('⚠️ Admin password verification failed, resetting password...');
          existingAdmin.password = 'admin123'; // Will be hashed by pre-save hook
          await existingAdmin.save();
          if (process.env.NODE_ENV !== 'test') console.log('✅ Admin password has been reset and re-hashed');
        }
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') console.error('❌ Error creating default admin user:', error.message);
  }
};

// Connect to database and create admin (skip in test environment)
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    createDefaultAdmin();
  });
}

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiters
const { authLimiter } = require('./middleware/rateLimiter');

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/events', eventRoutes);

// Expos, booths, exhibitors, and schedules
const expoRoutes = require('./routes/expos');
const boothRoutes = require('./routes/booths');
const exhibitorRoutes = require('./routes/exhibitors');
const messageRoutes = require('./routes/messages');
const scheduleRoutes = require('./routes/schedules');

app.use('/api/expos', expoRoutes);
app.use('/api/booths', boothRoutes);
app.use('/api/exhibitors', exhibitorRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/schedules', scheduleRoutes);

// Attendee endpoints
const attendeeRoutes = require('./routes/attendees');
app.use('/api/attendees', attendeeRoutes);

// Analytics endpoints
const analyticsRoutes = require('./routes/analytics');
app.use('/api/analytics', analyticsRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(err.status || 500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;

// Setup HTTP server + Socket.io for real-time features
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Attach io to app so routes can emit events
app.set('io', io);

io.on('connection', (socket) => {
  console.log('New socket connection:', socket.id);

  // If client provided a token during handshake, verify and add to a user-specific room
  try {
    const token = socket.handshake?.auth?.token;
    if (token) {
      const raw = token.replace('Bearer ', '');
      const decoded = jwt.verify(raw, process.env.JWT_SECRET);
      if (decoded && decoded.id) {
        socket.join(`user_${decoded.id}`);
        console.log(`Socket ${socket.id} joined user_${decoded.id}`);
      }
    }
  } catch (err) {
    console.error('Socket auth error:', err.message);
  }

  // Join room for expo updates
  socket.on('join-expo', (expoId) => {
    socket.join(`expo_${expoId}`);
  });

  // Chat messages (broadcast to expo room)
  socket.on('chat:message', ({ expoId, message, from }) => {
    io.to(`expo_${expoId}`).emit('chat:message', { message, from, timestamp: new Date() });
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export app and server for tests
module.exports = { app, server };
