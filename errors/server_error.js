const ServerError = (err, req, res, next) => {
  console.error(`(${err.statusCode}) ${err.message}`);
  res.send({ message: 'На сервере произошла ошибка' });
  next();
};

module.exports = ServerError;
