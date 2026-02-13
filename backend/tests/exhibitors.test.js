const request = require('supertest');
const { setupTestDB, teardownTestDB } = require('./setup');
let app;

beforeAll(async () => {
  await setupTestDB();
  const srv = require('../server');
  app = srv.app;
});

afterAll(async () => {
  await teardownTestDB();
});

const User = require('../models/User');
const Expo = require('../models/Expo');
const jwt = require('jsonwebtoken');

describe('Exhibitor Registration API', () => {
  it('should allow exhibitor user to register for an expo', async () => {
    const expo = await Expo.create({ title: 'Expo Reg', startDate: new Date(), endDate: new Date(), location: 'Venue' });

    const user = await User.create({ firstName: 'Ex', lastName: 'Reg', email: 'exreg@test.com', password: 'password123', role: 'exhibitor' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const payload = { expo: expo._id.toString(), companyName: 'Test Co', companyDescription: 'We do things' };

    const res = await request(app)
      .post('/api/exhibitors/register')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.registration.companyName).toBe('Test Co');
  });

  it('should return 400 for invalid payload', async () => {
    const user = await User.create({ firstName: 'Ex2', lastName: 'Reg', email: 'exreg2@test.com', password: 'password123', role: 'exhibitor' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const res = await request(app)
      .post('/api/exhibitors/register')
      .set('Authorization', `Bearer ${token}`)
      .send({ expo: 'invalid-id', companyName: '' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });
});