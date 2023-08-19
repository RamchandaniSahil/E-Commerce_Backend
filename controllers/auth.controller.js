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
  try {
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

    res.cooki("token", token, cookiOptions);

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {}
});
