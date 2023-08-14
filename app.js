const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config();

const user = require('./models/user');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.use(bodyParser.json());

app.use('/users', require('./routes/users'));
//app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});