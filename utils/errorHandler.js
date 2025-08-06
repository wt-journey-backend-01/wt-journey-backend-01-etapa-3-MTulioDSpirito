// utils/errorHandler.js

function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const message = err.message || 'Erro interno do servidor.';

  res.status(status).json({ message });
}

module.exports = errorHandler;
