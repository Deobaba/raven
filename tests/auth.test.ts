import request from 'supertest';
import { app } from '../src/app';

describe('Authentication', () => {
  describe('POST /api/v1/auth/signup', () => {
    it('should create a new user', async () => {
      const userData = {
        full_name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        phone_number: '+2348012345678',
      };

      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.token).toBeDefined();
    });

    it('should return validation error for invalid data', async () => {
      const userData = {
        full_name: '',
        email: 'invalid-email',
        password: '123',
        phone_number: 'invalid-phone',
      };

      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      // First create a user
      const userData = {
        full_name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        phone_number: '+2348012345678',
      };

      await request(app)
        .post('/api/v1/auth/signup')
        .send(userData);

      // Then login
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
    });

    it('should return error for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
}); 