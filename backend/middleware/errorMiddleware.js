export const errorMiddleware = (err, req, res, next) => {
    let status = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Handle Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const messageList = Object.values(err.errors).map(val => val.message);
        message = messageList.join(', ');
        status = 400;
    }

    // Handle Mongoose Duplicate Key Error
    if (err.code === 11000) {
        message = `Duplicate value entered for ${Object.keys(err.keyValue).join(', ')}`;
        status = 400;
    }

    // Handle Mongoose Cast Error (Invalid ID)
    if (err.name === 'CastError') {
        message = `Resource not found with id of ${err.value}`;
        status = 404;
    }

    res.status(status).json({
        success: false,
        message,
    });
};