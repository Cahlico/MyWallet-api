const bcrypt = require('bcrypt');
const connection = require('../database');

async function isEmailAvailable(email) {
    return connection.query(`SELECT * FROM users WHERE email=$1`, [email]);
}

async function createUser(user) {
    const { username, email, password, passwordConfirmation } = user;
    const newUser = [
        username, 
        email, 
        bcrypt.hashSync(password, 12), 
        bcrypt.hashSync(passwordConfirmation, 12)
    ];

    try {
        await connection.query(`INSERT INTO users (username, email, password, "passwordConfirmation") VALUES $1, $2, $3, $4`, newUser);
    } catch {
        return null;
    }

    return await connection.query(`SELECT * FROM users WHERE email = $1`, [email]);
}

async function findUser(email, password) {
    try {
        return connection.query('SELECT * FROM users WHERE email=$1 and bcrypt.compareSync($2, password)', [email, password]);
    } catch {
        return null;
    }
}

module.exports = {
    isEmailAvailable,
    createUser,
    findUser
};