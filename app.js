const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

require('dotenv').config();

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');


app.get('/', (req, res) => res.send('Сервер в работе'));

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);
app.use(require('./routes/users'));
app.use(require('./routes/cards'));


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});