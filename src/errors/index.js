const BadRequestError = require("./badRequest");
const NotFoundError = require("./notFound");
const UnauthenticatedError = require("./unauthenticated");
const ForbiddenError = require("./forbidden");
const CustomError = require("./customError");
const CreateError = require("./createError");

module.exports = {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
  ForbiddenError,
  CustomError,
  CreateError,
};
