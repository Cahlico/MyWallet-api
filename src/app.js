require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();

const usersController = require('./controllers/usersControllers');
const authMiddleware = require('./middlewares/authorization');
const paymentController = require('./controllers/paymentController');

app.use(cors());
app.use(express.json());

// User Routes
app.post('/api/sign_up', usersController.postSignUp);
app.post('/api/sign_in', usersController.postSignIn);

// Payment Routes
app.post('/api/payment', authMiddleware, paymentController.moveAccount);
app.get('/api/payment', authMiddleware, paymentController.getBalance)

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});