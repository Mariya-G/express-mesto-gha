const ServerError = (err, req, res, next) => {
  console.error(err.message);
  res.status(err.statusCode).send({ message: 'На сервере произошла ошибка' });
  next();
};

module.exports = ServerError;
