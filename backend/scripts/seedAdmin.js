const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eventsphere';

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`📦 Connected to MongoDB: ${mongoose.connection.name}`);

    const email = 'admin@gmail.com';
    const password = 'admin123';

    const existing = await User.findOne({ email });
    if (existing) {
      console.log('✅ Admin already exists:', email);
      return;
    }

    await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email,
      password,
      role: 'admin',
    });

    console.log('✅ Admin user created successfully');
    console.log('   Email: admin@gmail.com');
    console.log('   Password: admin123');
  } catch (err) {
    console.error('❌ Failed to seed admin:', err.message);
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();
