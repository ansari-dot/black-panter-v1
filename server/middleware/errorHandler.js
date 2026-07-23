const errorHandler = (err, req, res, next) => {
  console.error('ERROR:', err.message);
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ message: `Duplicate value: ${field} already exists.` });
  }
  const status = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(status).json({ message: err.message });
};

export default errorHandler;
