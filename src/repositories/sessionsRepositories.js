const bcrypt = require('bcrypt');
const uuid = require('uuid');
const connection = require('../database');

async function createSession(userId) {
    const token = uuidv4();

    try {
        await connection.query('INSERT INTO sessions ("userId", token) VALUES $1, $2', [userId, token]);
    } catch {
        return null;
    }

    try {
        return connection.query('SELECT * FROM sessions WHERE "userId"=$1 and token=$2', [userId, token]);
    } catch {
        return null;
    }
}

module.exports = { 
    findUser,
    createSession
};