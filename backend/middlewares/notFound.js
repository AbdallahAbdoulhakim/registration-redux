const notFound = (req, res, next) => {
  res.status(404);
  const err = new Error(`Error 404 : Resource not found at ${req.originalUrl}`);
  next(err);
};

export default notFound;
