const express = require("express");
const {
  createCoupon,
  getAllCoupon,
  deactivateCoupon,
  deleteCoupon,
} = require("../controllers/coupons.controller");
const router = express.Router();

router.get("/", getAllCoupon);
router.post("/create", createCoupon);
router.put("/deactive/:id", deactivateCoupon);
router.delete("/:id", deleteCoupon);

module.exports = router;
