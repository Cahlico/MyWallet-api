const userSchemas = require('../schemas/userSchemas');
const { isEmailAvailable, createUser, findUser } = require('../repositories/userRepositories');
const { createSession } = require('../repositories/sessionsRepositories');

async function postSignUp(req, res) {
    const userParams = req.body;

    const { error } = userSchemas.signUp.validate(userParams);
    if (error) return res.status(422).send({ error: error.details[0].message });

    const isAvailable = isEmailAvailable(userParams.email);
    if(!isAvailable) {
        return res.status(409).json({ error: 'Email já se encontra em uso' });
    }

    const user = await createUser(userParams);
    const { email, username, id } = user;

    return res.status(201).send({ email, username, id });
}

async function postSignIn(req, res) {
    const userParams = req.body;

    const { error } = userSchemas.signIn.validate(userParams);
    if (error) return res.status(422).send({ error: error.details[0].message });

    const { email, password } = userParams;
    const user = await findUser(email, password);
    if (!user) return res.status(401).send({ error: 'Email ou senha incorretos' });

    const { token } = await createSession(user.id);

    const { email, id, userId } = user;
    const userData = { email, id, userId, token };

    return res.send({ userData });
}

module.exports = {
    postSignUp,
    postSignIn
};
