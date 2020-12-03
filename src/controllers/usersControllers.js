const userSchemas = require('../schemas/userSchemas');
const { isEmailAvailable, createUser, findUser } = require('../repositories/userRepository');
const { createSession } = require('../repositories/sessionsRepository');

async function postSignUp(req, res) {
    const userParams = req.body;

    const { error } = userSchemas.signUp.validate(userParams);
    if (error) return res.status(422).send({ error: error.details[0].message });

    const isAvailable = await isEmailAvailable(userParams.email);
    if(isAvailable.rows[0]) {
        return res.status(409).send('Email já se encontra em uso');
    }

    const user = await createUser(userParams);
    if(user === null) return res.status(500).send('erro interno do sistema');

    const { email, username, id } = user.rows[0];

    return res.status(201).send({ email, username, id });
}

async function postSignIn(req, res) {
    const userParams = req.body;

    const { error } = userSchemas.signIn.validate(userParams);
    if (error) return res.status(422).send({ error: error.details[0].message });

    const user = await findUser(userParams.email, userParams.password);
    if (user === null) return res.status(401).send({ error: 'Email ou senha incorretos' });

    const result = await createSession(user.rows[0]);
    if(result === null) return res.status(500).send('erro interno do sistema');

    const { token, email, id, userId } = result.rows[0];

    const userData = { email, id, userId, token };

    return res.send(userData).status(200);
}

module.exports = {
    postSignUp,
    postSignIn
};
