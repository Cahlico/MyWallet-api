const uuid = require('uuid');
const connection = require('../database');

async function createSession(user) {
    const token = uuid.v4();

    const { email, id, password } = user;
    try {
        await connection.query('INSERT INTO sessions (email, "userId", token, password) VALUES ($1, $2, $3, $4)', [email, id, token, password]);
    } catch {
        return null;
    }

    try {
        return connection.query('SELECT * FROM sessions WHERE "userId"=$1 and token=$2', [id, token]);
    } catch {
        return null;
    }
}

async function findByToken(token) {
    return connection.query('SELECT * FROM sessions WHERE token=$1', [token]);
}

async function endSession(userId) {
    try {
        await connection.query('DELETE FROM sessions WHERE "userId"=$1', [userId]);
    } catch {
        return null;
    }
}

module.exports = { 
    createSession,
    findByToken,
    endSession
};