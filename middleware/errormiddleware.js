// middleware/errorMiddleware.js
const handleError = (error, req, res, next) => {
    console.error(error.stack);
    res.status(error.status || 500).json({
        message: error.message || 'Internal Server Error',
        details: error.details || null,
    });
};

module.exports = handleError;
