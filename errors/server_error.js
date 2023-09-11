const ServerError = (err, req, res, next) => {
  console.error(`${err.message}: ошибка (${err.statusCode})`);
  res.status(500).send({ message: 'На сервере произошла ошибка' });
  next();
};

module.exports = ServerError;
