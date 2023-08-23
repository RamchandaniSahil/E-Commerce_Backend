const User = require("../models/user.schema");
const asyncHandler = require("../services/asyncHandler");
const CustomError = require("../utils/customError");
const mailHelper = require("../utils/mailHelper");
const crypto = require("crypto");

const cookiOptions = {
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true,
  //could be in a sepreat file in utils
};

/***************************************************
 * @HOME
 * @route http://localhost:4000/api/auth
 * @description Homepage for Login and Signup
 ****************************************************/
exports.authHome = asyncHandler(async (req, res) => {
  res.status(200).send("User Auth Working Properly");
});

/***************************************************
 * @SIGNUP
 * @route http://localhost:4000/api/auth/signup
 * @description User signup controller for creating a new user
 * @parameters name, email, password
 * @return User Object
 ****************************************************/
exports.signUp = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new CustomError("Please fill all fields", 400);
  }

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError("User already exists", 400);
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = user.getJwtToken();
  // console.log(user);
  user.password = undefined;

  res.cookie("token", token, cookiOptions);

  res.status(200).json({
    success: true,
    token,
    user,
  });
});

/***************************************************
 * @LOGIN
 * @route http://localhost:4000/api/auth/login
 * @description User signIn controller for login a user
 * @parameters email, password
 * @return User Object
 ****************************************************/
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError("Please fill all fields", 400);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new CustomError("Invalid credentials", 400);
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (isPasswordMatch) {
    const token = user.getJwtToken();
    user.password = undefined;
    res.cookie("token", token, cookiOptions);
    return res.status(200).json({
      success: true,
      token,
      user,
    });
  }

  throw new CustomError("Invalid credentials - pass", 400);
});

/***************************************************
 * @LOGOUT
 * @route http://localhost:4000/api/auth/logout
 * @description User logout by clearing user cookies
 * @parameters
 * @return Success message
 ****************************************************/
exports.logout = asyncHandler(async (_req, res) => {
  // res.clearCookie()
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

/***************************************************
 * @FORGOT_PASSWORD
 * @route http://localhost:4000/api/auth/password/forgot
 * @description User will submit email and we will generat a token
 * @parameters emial
 * @return Success message - email send
 ****************************************************/
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  // check email for null

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  const resetToken = user.generateForgotPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/password/reset/${resetToken}`;

  const text = `Your password reset url is
  \n\n ${resetUrl} \n\n`;

  try {
    await mailHelper({
      emial: user.email,
      subject: "Password reset email for website",
      text: text,
    });
    res.status(200).json({
      success: true,
      message: `Email sen to ${user.email}`,
    });
  } catch (error) {
    // roll back -clear fields and save
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save({ validateBeforeSave: false });

    throw new CustomError(err.message || "Email send failure", 500);
  }
});

/***************************************************
 * @RESET_PASSWORD
 * @route http://localhost:4000/api/auth/password/reset/:reserToken
 * @description User will able to reset password based on url token
 * @parameters token from url, password and confirmPassword
 * @return User object
 ****************************************************/
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token: resetToken } = req.params;
  const { password, confirmPassword } = req.body;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    forgotPasswordToken: resetPasswordToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new CustomError("Password Token is invalid or expired", 400);
  }

  if (password !== confirmPassword) {
    throw new CustomError("Password and Confirm Password does not match", 400);
  }

  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save();

  // create token and send as response
  const token = user.getJwtToken();
  user.password = undefined;
  res.cookie("token", token, cookiOptions);
  res.status(200).json({
    success: true,
    user,
  });
});

// TODO: create a controller for change password

/***************************************************
 * @GET_PROFILE
 * @REQUEST_TYPE GET
 * @route http://localhost:4000/api/auth/profile
 * @description Check for token and populate req.user
 * @parameters
 * @return User object
 ****************************************************/
exports.getProfile = asyncHandler(async (req, res) => {
  const { user } = req;
  if (!user) {
    throw new CustomError("User not found", 404);
  }
  res.status(200).json({
    success: true,
    user,
  });
});
