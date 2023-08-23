const express = require("express");
const {
  authHome,
  signUp,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getProfile,
} = require("../controllers/auth.controller");
const router = express.Router();

router.get("/", authHome);
router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.post("/password/forgot", forgotPassword);
router.post("/password/reset/:reserToken", resetPassword);
router.post("/profile", getProfile);

module.exports = router;
