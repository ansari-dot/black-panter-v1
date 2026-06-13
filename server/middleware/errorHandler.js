const errorHandler = (err, req, res, next) => {
  console.error('ERROR:', err.message);
  const status = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(status).json({ message: err.message });
};

export default errorHandler;
