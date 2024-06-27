// utils/errorUtil.js
class CustomError extends Error {
    constructor(message, status, details = null) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

const createError = (message, status, details = null) => {
    return new CustomError(message, status, details);
};

module.exports = { createError, CustomError };
