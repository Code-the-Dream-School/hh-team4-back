const { StatusCodes } = require("http-status-codes");

const {
  NotFoundError,
  UnauthenticatedError,
  ForbiddenError,
  CustomError,
} = require("../errors");

const errorHandler = (err, req, res, next) => {
  //Debugging Console Log
  console.log(err);

  //Default error response
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR; //500
  let message = err.message || "Something went wrong...";

  //Specific error types
  if (err.name === "ValidationError") {
    statusCode = StatusCodes.BAD_REQUEST; //400
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(" and ");
  }

  //invalid ID or value
  if (err.name === "CastError") {
    statusCode = StatusCodes.NOT_FOUND; //404
    message = `No item found with id ${err.value}`;
  }

  //MongoDB Duplicate key/fields
  if (err.code && err.code === 11000) {
    statusCode = StatusCodes.BAD_REQUEST; //400
    message = `The ${Object.keys(err.keyValue)} is already in use`;
  }

  //Custom error handling
  if (err instanceof CustomError) {
    message = err.message || message;
    statusCode = err.statusCode || statusCode;
  }

  // Handle specific errors
  if (err instanceof NotFoundError) {
    statusCode = StatusCodes.NOT_FOUND; //404
    message = err.message || "Resource not found";
  }

  //Access restricted for user
  if (err instanceof ForbiddenError) {
    statusCode = StatusCodes.FORBIDDEN; //403
    message = err.message || "User access forbidden";
  }

  //Unauthorized
  if (err instanceof UnauthenticatedError) {
    statusCode = StatusCodes.UNAUTHORIZED; //401
    message = err.message || "Invalid authentication";
  }

  //Error message/status response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
    },
  });
};

module.exports = errorHandler;
