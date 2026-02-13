const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Expo = require('../models/Expo');
const User = require('../models/User');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eventsphere';

const seedExpos = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`📦 Connected to MongoDB: ${mongoose.connection.name}`);

    // Find admin user
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('❌ Admin user not found. Please run seedAdmin.js first.');
      return;
    }

    // Sample expos data
    const sampleExpos = [
      {
        title: 'Tech Conference 2024',
        startDate: new Date('2024-12-01'),
        endDate: new Date('2024-12-03'),
        location: 'Convention Center, New York',
        description: 'A premier technology conference featuring the latest innovations in AI, blockchain, and software development.',
        theme: 'Innovation & Technology',
        floorPlan: 'Main Hall, Exhibit Area, Conference Rooms',
        organizer: admin._id,
        status: 'published'
      },
      {
        title: 'Business Expo 2024',
        startDate: new Date('2024-11-15'),
        endDate: new Date('2024-11-17'),
        location: 'Business Center, Los Angeles',
        description: 'Connect with industry leaders and explore business opportunities at our annual business expo.',
        theme: 'Business & Networking',
        floorPlan: 'Exhibition Hall, Meeting Rooms, Networking Lounge',
        organizer: admin._id,
        status: 'published'
      },
      {
        title: 'Healthcare Innovation Summit',
        startDate: new Date('2024-10-20'),
        endDate: new Date('2024-10-22'),
        location: 'Medical Center, Chicago',
        description: 'Advancing healthcare through technology and innovation. Join medical professionals and tech experts.',
        theme: 'Healthcare & Technology',
        floorPlan: 'Auditorium, Exhibit Space, Workshop Rooms',
        organizer: admin._id,
        status: 'published'
      }
    ];

    for (const expoData of sampleExpos) {
      const existing = await Expo.findOne({ title: expoData.title });
      if (!existing) {
        await Expo.create(expoData);
        console.log(`✅ Created expo: ${expoData.title}`);
      } else {
        console.log(`⚠️ Expo already exists: ${expoData.title}`);
      }
    }

    console.log('✅ Sample expos seeded successfully');
  } catch (err) {
    console.error('❌ Failed to seed expos:', err.message);
  } finally {
    await mongoose.disconnect();
  }
};

seedExpos();
