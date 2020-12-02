const bcrypt = require('bcrypt');
const uuid = require('uuid');
const connection = require('../database');

async function createSession(user) {
    const token = uuid.v4();
    console.log(user)
    console.log(token)

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

module.exports = { 
    createSession
};