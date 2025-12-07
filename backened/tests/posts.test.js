const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Post = require('../models/Post');

let authToken;
let testPostId;

beforeAll(async () => {
  const testDbUri = process. env.MONGO_URI_TEST || 'mongodb://localhost:27017/hackharbor_test';
  
  if (mongoose.connection. readyState === 0) {
    await mongoose.connect(testDbUri);
  }

  // Create a test user and get token
  const res = await request(app)
    .post('/api/auth/register')
    . send({
      name: 'Post Test User',
      email: 'posttest@example.com',
      password: 'password123'
    });

  authToken = res.body.token;
});

afterAll(async () => {
  await User.deleteMany({ email: /test/i });
  await Post.deleteMany({});
  await mongoose.connection.close();
});

describe('Posts API', () => {
  describe('POST /api/posts', () => {
    it('should create a new post', async () => {
      const res = await request(app)
        . post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Post Title',
          body: 'This is the test post body content that is long enough.',
          tags: ['test', 'jest']
        });

      expect(res. statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Test Post Title');
      
      testPostId = res. body.data._id;
    });

    it('should not create post without auth', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({
          title: 'Test Post',
          body: 'This is a test post body.'
        });

      expect(res.statusCode).toBe(401);
    });

    it('should not create post without title', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          body: 'This is a test post body.'
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('PATCH /api/posts/:id', () => {
    it('should update a post', async () => {
      const res = await request(app)
        .patch(`/api/posts/${testPostId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Test Post Title',
          body: 'This is the updated test post body content.'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Updated Test Post Title');
    });

    it('should not update post without auth', async () => {
      const res = await request(app)
        .patch(`/api/posts/${testPostId}`)
        .send({
          title: 'Unauthorized Update'
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/posts', () => {
    it('should get all posts', async () => {
      const res = await request(app). get('/api/posts');

      expect(res. statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)). toBe(true);
    });

    it('should support search', async () => {
      const res = await request(app)
        .get('/api/posts')
        .query({ search: 'Updated' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should support pagination', async () => {
      const res = await request(app)
        .get('/api/posts')
        .query({ page: 1, limit: 5 });

      expect(res.statusCode).toBe(200);
      expect(res.body.page).toBe(1);
      expect(res.body.limit).toBe(5);
    });
  });

  describe('DELETE /api/posts/:id', () => {
    it('should delete a post', async () => {
      const res = await request(app)
        .delete(`/api/posts/${testPostId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});