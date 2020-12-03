const paymentSchemas = require('../schemas/paymentSchemas');
const { transaction, getBalanceById } = require('../repositories/paymentRepository');

async function moveAccount(req, res) {
    const paymentParams = req.body;

    const { error } = paymentSchemas.moveAccount.validate(paymentParams);
    if(error) return res.status(422).send({ error: error.details[0].message });

    const response = await transaction(req.body);
    if(response === null) return res.status(500).send('erro interno do sistema');

    return res.sendStatus(200);
}

async function getBalance(req, res) {
    const { userId } =  req.session;

    const response = await getBalanceById(userId);
    if(response === null);

    const account = response.rows;
    res.send(account).status(200);
}

module.exports = {
    moveAccount,
    getBalance
};