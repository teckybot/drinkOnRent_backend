
export const removeHeaders = (req, res, next) => {
  res.removeHeader('Connection');
  next();
};

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
};
