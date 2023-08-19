import User from "../models/user.schema";
import asyncHandler from "../services/asyncHandler";
import CustomError from "../utils/customError";

export const cookiOptions = {
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 100),
  httpOnly: true,
  //could be in a sepreat file in utils
};

/***************************************************

* @SIGNUP
* @route http://localhost:4000/api/auth/signup
* @description User signup controller for creating a new user
* @parameters name, email, password
* @return User Object

****************************************************/

export const signUp = asyncHandler(async (req, res) => {
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
  console.log(user);
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

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError("Please fill all fields", 400);
  }

  const user = User.findOne({ email }).select("+password");

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

export const logout = asyncHandler(async (_req, res) => {
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
