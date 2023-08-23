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

router.get("/api/auth", authHome);
router.post("/api/auth/signup", signUp);
router.post("/api/auth/login", login);
router.post("/api/auth/logout", logout);
router.post("/api/auth/password/forgot", forgotPassword);
router.post("/api/auth/password/reset/:reserToken", resetPassword);
router.post("/api/auth/profile", getProfile);

module.exports = router;
