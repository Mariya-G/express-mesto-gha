const express = require('express');
const mongoose = require('mongoose');

const router = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();

// Подключение БД
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
})
  .then(() => console.log('Подключено'));

app.use(express.json());

// Временная авторизация
app.use((req, res, next) => {
  req.user = {
    _id: '64de21757d06510178952e60',
  };

  next();
});

app.use(router);

app.listen(PORT, () => console.log(`Подключен: ${PORT}`));

