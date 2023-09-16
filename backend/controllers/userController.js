const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

const sendEmail = require("../utils/sendEmail");

// Register a User
exports.createUser = catchAsyncErrors(async (req, res, next) => {
  // console.log(req.body);
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  sendToken(user, 201, res);
});

// login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if email and password are provided [BOTH]
  if (!password || !email) {
    return next(new ErrorHandler("please enter the email and password.", 400));
  }

  //   verify if the user exists with this email
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("invalid email or password.", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("invalid email or password.", 401));
  }

  sendToken(user, 200, res);
});

// logout User
exports.logOut = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "loggedOut",
  });
});

// heavy algoritm, I love it.
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    next(
      new ErrorHandler(
        `user with ${req.body.email} does not exists in out database.`,
        404
      )
    );
  }

  const token = user.getResetPasswordToken();

  user.save({ validateBeforeSave: false });

  const resetPasswordLink = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${await token}`;

  const emailMessage = `Hi Friend! \n\n This is your reset password link. \n ${resetPasswordLink} \n\n
  It will expire after 15 minutes. If you don't request this reset link. you can simply ignore this emai.`;

  try {
    // sendEmail({
    //   email: user.email,
    //   subject: "Reset Password Link Inside | eCommerce MERN App",
    //   emailMessage,
    // });

    res.status(200).json({
      success: true,
      message: "You will shortly get the email. check your spam folder too.",
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    user.save({ validateBeforeSave: false });

    next(
      new ErrorHandler(
        "Some error occured while sending reset password to your email. Try again after sometime."
      )
    );
  }
});

// handle reset password link
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    next(
      new ErrorHandler(
        `Reset Password Token is invalid or has been expired.`,
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    next(new ErrorHandler(`password and corfirm password are not same.`, 400));
  }

  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// option for user to view their profile
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// call when user try to update password within their profile
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    next(new ErrorHandler(`Your entered existing password is incorrect`, 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    next(
      new ErrorHandler(
        `New password and confirm password fields are'nt same.`,
        400
      )
    );
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 201, res);
});

// enable users to update name, email, profilePic
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // we will add cloudinary later
  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({ success: true, message: "Profile Updated!" });
});

// Admin Route Controllers

// Get all Users -- admin
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// get single user detail -- admin
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    next(
      new ErrorHandler(`user with the id ${req.params.id} does not exist.`, 404)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// update user role -- admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({ success: true, message: "User profile updated!" });
});

// delete a user -- admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    next(
      new ErrorHandler(`user with the id ${req.params.id} does'nt exist.`, 404)
    );
  }

  // double check
  await user.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
