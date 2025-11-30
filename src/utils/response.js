

export const asyncHandler = (fn) => (req, res, next) => {
    fn(req, res, next).catch((error) => {
        console.error("Async Handler Error:", error);
        next(new Error(error.message || "Internal Server Error", { cause: error.status || 500 }));
    });
}

    export const globalErrorHandler = (error, req, res, next) => {
        console.error("Global Error Handler:", error);
        res.status(error.cause || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            error: error.stack || error.toString()
        });
    }


export const successResponse = ({res, data = {}, message = 'Operation successful', statusCode = 200}={}) => {
    res.status(statusCode).json({
        success: true,
        message,
        data
    });
}

