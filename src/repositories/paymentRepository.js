const connection = require('../database');

async function transaction(body) {

    let response;
    const { userId, value, description, entry } = body;

    try {
        response = await connection.query('SELECT * FROM balance WHERE "userId"=$1', [userId]);
    } catch {
        return null;
    }

    const { total } = response;
    const newTotal = calculate(total, value, entry);
    const accountMovement = { value, description, entry }

    try {
        await connection.query('INSERT INTO balance ("userId", total, "accountMovement") VALUES ($1, $2, $3)', [userId, newTotal, accountMovement]);
    } catch {
        return null;
    }

    try {
        return connection.query('SELECT * FROM balance WHERE "userId"=$1', [userId]);
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

function calculate(total, value, entry) {
    if(entry === true) return total + value;
    else return total - value;
}

module.exports = {
    transaction,
    getBalanceById
};

/*
bd.data = {
    id
    total
    accountMovement
    userId
}

*/