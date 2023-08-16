const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config();

//const User = require('./models/user');
//const UserRouter = require ('./routes/users');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());


app.use((req, res, next) => {
  req.user = {
    _id: '64dc0044352a17b04703c596'
  };
  next();
});

app.get('/', (req, res) => res.send('Сервер в работе'));
app.use(require ('./routes/users'));
app.use(require ('./routes/cards'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});