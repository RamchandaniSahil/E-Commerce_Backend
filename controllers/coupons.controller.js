const Coupon = require("../models/coupon.schema");
const asyncHandler = require("../services/asyncHandler");
const CustomError = require("../utils/customError");

/***************************************************
 * @CREATE_COUPON
 * @route http://localhost:4000/api/coupon/create
 * @description Controller used for creating a new coupon
 * @description Only admin and Moderator can create a coupon
 * @return Coupon Object with success message "Coupon Created Successfully"
 ****************************************************/
exports.createCoupon = asyncHandler(async (req, res) => {
  const { code, discount, active } = req.body;

  if (!code) {
    throw new CustomError("Code are required", 400);
  }

  const coupon = await Coupon.create({
    code,
    discount,
    active,
  });

  res.status(200).json({
    success: true,
    message: "Coupon Created Successfully",
    coupon,
  });
});

/***************************************************
 * @DEACTIVATE_COUPON
 * @route http://localhost:4000/api/coupon/deactive/:couponId
 * @description Controller used for deavtivation the coupon
 * @description Only admin and Moderator can create update the coupon
 * @return Coupon Object with success message "Coupon Deactivated Successfully"
 ****************************************************/
exports.deactivateCoupon = asyncHandler(async (req, res) => {
  const { id: couponId } = req.params;
  const deactivate = await Coupon.findByIdAndUpdate(couponId, {
    active: false,
  });
  res.status(200).json({
    success: true,
    message: "Coupon Deactivated Successfully",
    deactivate,
  });
});

/***************************************************
 * @DELETE_COUPON
 * @route http://localhost:4000/api/coupon/:couponId
 * @description Controller used for deleteing the coupon
 * @description Only admin and Moderator can delete the coupon
 * @return Success message "Coupon Deleted Successfully"
 ****************************************************/
exports.deleteCoupon = asyncHandler(async (req, res) => {
  const { id: couponId } = req.params;
  const couponToDelete = await Coupon.findByIdAndDelete(couponId);
  if (!couponToDelete) {
    throw new CustomError("Coupon not found", 400);
  }
  res.status(200).json({
    success: true,
    message: "Coupon Deleted Successfully",
    couponToDelete,
  });
});

/***************************************************
 * @GET_ALL_COUPON
 * @route http://localhost:4000/api/coupon
 * @description Controller used for getting all coupons details
 * @description Only admin and Moderator can get all the coupon
 * @return allCoupons Object
 ****************************************************/
exports.getAllCoupon = asyncHandler(async (req, res) => {
  const getCoupon = await Coupon.find();
  if (!getCoupon) {
    throw new CustomError("Collection not found", 400);
  }
  res.status(200).json({
    success: true,
    message: "All Coupons Found",
    getCoupon,
  });
});
