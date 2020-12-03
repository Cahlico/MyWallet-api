const db = require('../database');
const supertest = require('supertest');
const app = require('../app');

let authToken, userId;

beforeAll(async () => {
    await db.query('DELETE FROM users');
    await db.query('DELETE FROM sessions');
    await db.query('DELETE FROM balance');
});

afterAll(async () => {
    await db.query('DELETE FROM users');
    await db.query('DELETE FROM sessions');
    await db.query('DELETE FROM balance');
    db.end();
});

describe('POST /sign_up', () => {
    it('should return the body with the correct format', async () => {
        const body = {
            email: 'teste@email.com',
            username: 'teste',
            password: 'testeSenha',
            passwordConfirmation: 'testeSenha'
        };

        const response = await supertest(app).post('/api/sign_up').send(body);

        expect(response.status).toBe(201);

        userId = response.body.id

        expect(response.body).toHaveProperty('email');
        expect(response.body).toHaveProperty('username');
        expect(response.body).toHaveProperty('id');
    });

    it('should return 422 when passed invalid params', async () => {
        const body = {
            email: 'teste@email.com',
            username: 'teste',
            password: 'testeSenha',
            passwordConfirmation: 'testeSenha2'
        };

        const response = await supertest(app).post('/api/sign_up').send(body);

        expect(response.status).toBe(422);
    });
});

describe('POST sign_in', () => {
    it('should return the body with the correct format', async () => {
        const body = {
            email: 'teste@email.com',
            password: 'testeSenha'
        };

        const response = await supertest(app).post('/api/sign_in').send(body);

        expect(response.status).toBe(200);

        authToken = response.body.token;

        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('email');
        expect(response.body).toHaveProperty('userId');
        expect(response.body).toHaveProperty('token');
    });

    it('should return 401 when passed unmatched users', async () => {
        const body = {
            email: 'teste@email.com',
            password: 'testeSenhaErrada'
        };

        const response = await supertest(app).post('/api/sign_in').send(body);

        expect(response.status).toBe(401);
    });

    it('should return 422 when passed invalid params', async () => {
        const body = {
            email: '',
            password: 'testeSenha'
        };

        const response = await supertest(app).post('/api/sign_in').send(body);

        expect(response.status).toBe(422);
    });
});

describe('POST /api/payment', () => {
    it('should return 401 when there is missing token', async () => {
        const body = {
            userId: userId,
            value: 23,
            description: 'lunch',
            entry: true
        };

        const response = await supertest(app).post('/api/payment').send(body);

        expect(response.status).toBe(401);
    });

    it('should return 200 when the body is valid', async () => {
        const body = {
            userId: userId,
            value: 23,
            description: 'lunch',
            entry: true
        };

        const response = await supertest(app).post('/api/payment').set({ Authorization: `Bearer ${authToken}`}).send(body);

        expect(response.status).toBe(200);
    });

    it('should return 422 when the body is invalid', async () => {
        const body = {
            userId: '',
            value: 23,
            description: 'lunch',
            entry: true
        };

        const response = await supertest(app).post('/api/payment').set({ Authorization: `Bearer ${authToken}`}).send(body);

        expect(response.status).toBe(422);
    });
});

describe('GET /api/payment', () => {
    it('should return 200 when token is right', async () => {
        const response = await supertest(app).get('/api/payment').set({ Authorization: `Bearer ${authToken}`});

        expect(response.status).toBe(200);

        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('userId');
        expect(response.body[0]).toHaveProperty('value');
        expect(response.body[0]).toHaveProperty('entry');
        expect(response.body[0]).toHaveProperty('description');
    });

    it('should return 401 when there is missing token', async () => {

        const response = await supertest(app).get('/api/payment');

        expect(response.status).toBe(401);
    });
});

describe('DELETE /api/sessions', () => {

    it('should return 200 when its successfull', async () => {

        const response = await supertest(app).delete('/api/sessions').set({ Authorization: `Bearer ${authToken}`});

        expect(response.status).toBe(200);
    });

    it('should return 401 when there is missing token', async () => {

        const response = await supertest(app).delete('/api/sessions');

        expect(response.status).toBe(401);
    });
});