const ServerError = (err, req, res, next) => {
  console.error(`${err.message}: ошибка (${err.statusCode})`);
  const { statusCode = 500, message } = err;

  res.status(500)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};

module.exports = ServerError;
