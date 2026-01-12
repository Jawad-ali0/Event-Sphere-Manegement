const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User');
const authRoutes = require('./routes/auth');

// Load environment variables
dotenv.config();

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

      console.log('✅ Default admin user created:');
      console.log('   Email: admin@gmail.com');
      console.log('   Password: admin123');
    } else {
      // Check if password needs to be re-hashed (in case it was inserted directly)
      const bcrypt = require('bcryptjs');
      const isPasswordHashed = existingAdmin.password && (existingAdmin.password.startsWith('$2a$') || existingAdmin.password.startsWith('$2b$'));
      
      if (!isPasswordHashed) {
        // Password is not hashed, re-hash it
        const salt = await bcrypt.genSalt(10);
        existingAdmin.password = await bcrypt.hash('admin123', salt);
        await existingAdmin.save({ validateBeforeSave: false });
        console.log('✅ Admin password has been re-hashed');
      } else {
        // Verify password works, if not, reset it
        try {
          const isMatch = await existingAdmin.comparePassword('admin123');
          if (!isMatch) {
            // Password doesn't match, reset it
            existingAdmin.password = 'admin123'; // Will be hashed by pre-save hook
            await existingAdmin.save();
            console.log('✅ Admin password has been reset and re-hashed');
          } else {
            console.log('✅ Default admin user already exists with correct password');
          }
        } catch (compareError) {
          // If compare fails, reset password
          console.log('⚠️ Admin password verification failed, resetting password...');
          existingAdmin.password = 'admin123'; // Will be hashed by pre-save hook
          await existingAdmin.save();
          console.log('✅ Admin password has been reset and re-hashed');
        }
      }
    }
  } catch (error) {
    console.error('❌ Error creating default admin user:', error.message);
  }
};

// Connect to database and create admin
connectDB().then(() => {
  createDefaultAdmin();
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

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
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
