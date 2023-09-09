const express = require('express');
const mongoose = require('mongoose');

const { errors } = require('celebrate');

const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');

const ServerError = require('./errors/server_error');

const router = require('./routes');

const app = express();

// Подключение БД
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
mongoose.connect(DB_URL);

app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use(router);
app.use(errors());
app.use(ServerError);

app.listen(PORT, () => console.log(`Подключен: ${PORT}`));
