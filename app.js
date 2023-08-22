const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const { login, createUser } = require('./controllers/users');
const { validateLogin, validateCreateUser } = require('./middlewares/validation');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/NotFoundError');

require('dotenv').config();

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');


app.get('/', (req, res) => res.send('Сервер в работе'));

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

app.use(auth);
app.use(require('./routes/users'));
app.use(require('./routes/cards'));

app.use((req, res, next) => next(new NotFoundError('Страницы по запрошенному URL не существует')));
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});