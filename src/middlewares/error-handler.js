//Not found
const notFound = async (req, res, next) => {
    const error = new Error(`Not found: ${req.originalUrl}`);
    res.status(400);
    next(error);
}

// Error Handler
const errorHandler = async (err, req, res, next) => {
    err.statusCode = err.statusCode || err.code || 500;
    err.message = err.message || "Internal server error";
    res.status(err.statusCode);
    res.json({
        message: err.message,
        statusCode: err.statusCode,
        stack: err.stack
    });
}

module.exports = {notFound, errorHandler};