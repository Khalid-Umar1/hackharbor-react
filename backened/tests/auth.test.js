const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

// Use a different database for testing
beforeAll(async () => {
  const testDbUri = process.env. MONGO_URI_TEST || 'mongodb://localhost:27017/hackharbor_test';
  
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(testDbUri);
  }
});

// Clean up after each test
afterEach(async () => {
  await User.deleteMany({ email: /test/i });
});

// Close connection after all tests
afterAll(async () => {
  await mongoose. connection.close();
});

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        . send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(201);
      expect(res. body.success).toBe(true);
      expect(res. body.token).toBeDefined();
      expect(res.body.user. email).toBe('test@example.com');
    });

    it('should not register user with existing email', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test2@example.com',
          password: 'password123'
        });

      // Second registration with same email
      const res = await request(app)
        . post('/api/auth/register')
        .send({
          name: 'Test User 2',
          email: 'test2@example.com',
          password: 'password456'
        });

      expect(res. statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should not register user with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'password123'
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Login Test User',
          email: 'logintest@example.com',
          password: 'password123'
        });
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        . post('/api/auth/login')
        .send({
          email: 'logintest@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body. success).toBe(true);
      expect(res.body. token).toBeDefined();
    });

    it('should not login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        . send({
          email: 'logintest@example.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});