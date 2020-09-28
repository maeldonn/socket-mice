const notFound = (req, res) => {
  res.status(404).sendFile(path.resolve('client/dist/index.html'));
};

/* eslint-disable no-unused-vars */
const errorHandler = (err, req, res, next) => {
  /* eslint-enable no-unused-vars */
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
