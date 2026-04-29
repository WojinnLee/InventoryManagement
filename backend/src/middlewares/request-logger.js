function requestLogger(req, res, next) {
  const startedAt = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startedAt;
    const message = `${res.statusCode} ${req.method} ${req.originalUrl} ${duration}ms`;

    if (res.statusCode >= 400) {
      console.error(message);
      return;
    }

    console.log(message);
  });

  next();
}

module.exports = requestLogger;
