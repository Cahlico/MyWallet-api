require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();

const usersController = require('./controllers/usersControllers');

app.use(cors());
app.use(express.json());

app.post('/api/sign_up', usersController.postSignUp);
app.post('/api/sign_in', usersController.postSignIn);


const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});