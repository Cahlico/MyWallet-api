const connection = require('../database');

async function transaction(body) {

    const { userId, value, description, entry } = body;

    try {
        await connection.query('INSERT INTO balance ("userId", value, description, entry) VALUES ($1, $2, $3, $4)', [userId, value, description, entry]);
    } catch {
        return null;
    }
}

async function getBalanceById(userId) {
    try {
        return connection.query('SELECT * FROM balance WHERE "userId"=$1', [userId]);
    } catch {
        return null;
    }
}

module.exports = {
    transaction,
    getBalanceById
};