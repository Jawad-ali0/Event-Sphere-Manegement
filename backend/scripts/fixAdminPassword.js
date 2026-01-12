const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Load environment variables
dotenv.config();

const fixAdminPassword = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/eventsphere';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const adminEmail = 'admin@gmail.com';
    
    // Find admin user with password field
    const admin = await User.findOne({ email: adminEmail }).select('+password');

    if (!admin) {
      console.log('❌ Admin user not found. Creating new admin...');
      await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: adminEmail,
        password: 'admin123', // Will be hashed by pre-save hook
        role: 'admin',
      });
      console.log('✅ Admin user created successfully');
      await mongoose.disconnect();
      return;
    }

    console.log('✅ Admin user found');
    
    // Check if password is hashed
    const isPasswordHashed = admin.password && 
      (admin.password.startsWith('$2a$') || admin.password.startsWith('$2b$'));

    if (!isPasswordHashed) {
      console.log('⚠️ Admin password is not hashed. Hashing now...');
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash('admin123', salt);
      await admin.save({ validateBeforeSave: false });
      console.log('✅ Admin password has been hashed');
    } else {
      // Verify password works
      try {
        const isMatch = await admin.comparePassword('admin123');
        if (isMatch) {
          console.log('✅ Admin password is correct and working');
        } else {
          console.log('⚠️ Admin password does not match. Resetting...');
          admin.password = 'admin123'; // Will be hashed by pre-save hook
          await admin.save();
          console.log('✅ Admin password has been reset and re-hashed');
        }
      } catch (compareError) {
        console.log('⚠️ Password verification failed. Resetting password...');
        admin.password = 'admin123'; // Will be hashed by pre-save hook
        await admin.save();
        console.log('✅ Admin password has been reset and re-hashed');
      }
    }

    await mongoose.disconnect();
    console.log('✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixAdminPassword();
