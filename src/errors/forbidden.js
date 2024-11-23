const { StatusCodes } = require("http-status-codes");
const CustomError = require("./customError");

class ForbiddenError extends CustomError {
  constructor(message = "User Access Forbidden") {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = ForbiddenError;
