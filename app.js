const express = require('express');
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');

const { errors } = require('celebrate');
const { validateAuth, validateInfoUser } = require('./middlewares/validators');

const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');

const ServerError = require('./errors/server_error');

const router = require('./routes');

const app = express();

// Подключение БД
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
mongoose.connect(DB_URL);

app.use(express.json());
app.use(cookieParser());
app.post('/signup', validateInfoUser, createUser);
app.post('/signin', validateAuth, login);

app.use(auth);
app.use(router);
app.use(errors());
app.use(ServerError);

app.listen(PORT, () => console.log(`Подключен: ${PORT}`));
