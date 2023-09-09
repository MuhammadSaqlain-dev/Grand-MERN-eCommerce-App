const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");

// check if the user is loggedIn
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRETKEY);

  req.user = await User.findById(decodedData.id);

  next();
});

// check if the loggedIn user is "admin" or "user"
exports.authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to perform this action.`,
          403
        )
      );
    }
    next();
  };
};
