

export const asyncHandler = (fn) => (req, res, next) => {
        fn(req, res, next).catch((err)=>{
            console.error("asyncHandler error", err);
            next(new Error(err.message || "Something went wrong") ,{status:err.status || 500});
        })
    };

export const globalErrorHandler = (err , req , res , next ) => {
    console.error("globalErrorHandler error", err);
    res.status(err.status || 500).json({message: err.message || "Something went wrong" , success: false ,error:error.stack || error.toString()});
}


export const successResponse = (res , data={} , message = "success" , status = 200) => {
    res.status(status).json({message , success : true , data});
}

