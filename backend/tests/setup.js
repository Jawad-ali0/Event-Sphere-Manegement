const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

module.exports = {
  async setupTestDB() {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGODB_URI = uri;
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret1234567890123456789012';

    // Connect mongoose
    await mongoose.connect(uri);
  },

  async teardownTestDB() {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
  }
};