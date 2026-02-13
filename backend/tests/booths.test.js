const request = require('supertest');
const { setupTestDB, teardownTestDB } = require('./setup');
const mongoose = require('mongoose');
let app;

beforeAll(async () => {
  await setupTestDB();
  // require server AFTER setting MONGODB_URI
  const srv = require('../server');
  app = srv.app;
});

afterAll(async () => {
  // close server connections if any
  await teardownTestDB();
});

const User = require('../models/User');
const Expo = require('../models/Expo');
const Booth = require('../models/Booth');
const jwt = require('jsonwebtoken');

describe('Booths API (exhibitor flow)', () => {
  it('should let an exhibitor reserve an available booth and be returned in /booths/mine', async () => {
    // Create expo
    const expo = await Expo.create({ title: 'Test Expo', startDate: new Date(), endDate: new Date(), location: 'Test Location' });

    // Create booth
    const booth = await Booth.create({ expo: expo._id, boothNumber: 'A1', price: 100 });

    // Create exhibitor user
    const user = await User.create({ firstName: 'Ex', lastName: 'Hib', email: 'exhibitor@test.com', password: 'password123', role: 'exhibitor' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Reserve booth
    const res = await request(app)
      .post(`/api/booths/${booth._id}/reserve`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.booth.status).toBe('reserved');
    expect(res.body.booth.exhibitor).toBe(String(user._id));

    // Get my booths
    const mine = await request(app)
      .get('/api/booths/mine')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(mine.statusCode).toBe(200);
    expect(mine.body.success).toBe(true);
    expect(mine.body.booths.length).toBe(1);
    expect(mine.body.booths[0]._id).toBe(String(booth._id));
  }, 20000);
});