function notFoundHandler(req, res) {
  res.status(404).json({
    ok: false,
    message: "Route not found",
  });
}

function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  console.error("Unhandled error:", {
    method: req.method,
    url: req.originalUrl,
    statusCode,
    message,
    details: err.details || null,
  });

  res.status(statusCode).json({
    ok: false,
    message,
    ...(err.details ? { details: err.details } : {}),
  });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
