const request = require('supertest');
let server;

beforeAll(() => {
  server = require('../server'); // ensure server exports app/server if needed
});

describe('Health Check', () => {
  it('GET /api/health should return 200', async () => {
    const res = await request('http://localhost:5000').get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
