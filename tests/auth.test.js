const request = require('supertest');
const app = require('../index'); // Assurez-vous que votre index.js exporte l'application Express
const mongoose = require('mongoose');
const User = require('../models/User');

// Connexion à la base de données de test
beforeAll(async () => {
  const dbUri = process.env.DB_URI || 'mongodb://localhost:27017/nextup_test';
  await mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Supprime tous les utilisateurs après chaque test
afterEach(async () => {
  await User.deleteMany({});
});

// Déconnexion de la base de données après tous les tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth API', () => {
  it('should signup a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should login an existing user', async () => {
    // Créez d'abord un utilisateur
    await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      });

    // Ensuite, essayez de vous connecter avec le même utilisateur
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login a non-existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexisting@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Email ou mot de passe incorrect');
  });

  it('should not signup with invalid data', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        username: '',
        email: 'invalid-email',
        password: '123',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('errors');
  });
});
