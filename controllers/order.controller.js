const Product = require("../models/product.schema");
const Coupon = require("../models/coupon.schema");
const Order = require("../models/order.schema");
const asyncHandler = require("../services/asyncHandler");
const CustomError = require("../utils/customError");
const razorpay = require("../config/razorpay.config");

/***************************************************
 * @GENERATE_RAZORPAY_ID
 * @route http://localhost:4000/api/ouder/razorpay
 * @description Controller used for generating razorpay ID
 * @description Create a razorpay ID which is used for placing order
 * @return Order Object with "Razorpay  order id generated successfully"
 ****************************************************/

export const generateRazorpayOrderId = asyncHandler(async (req, res) => {
  const { address, phoneNumber } = req.body;
  /* 
  // get product and coupon from frontend
  */
  const { id: productId, id: couponId } = req.params;
  /* 
  // verfiy product price from backend
  // make DB query to get all products and info
  */
  const product = await Product.findById(productId);

  // Check if product is avaiable or not
  if (!productId) {
    throw new CustomError("Product not avaiable", 400);
  }

  // Check if product Stock is avaiable or not
  if (product.stock <= 0) {
    throw new CustomError("Product is Out of Stock", 400);
  }
  let price = product.price;
  let totalAmount;
  totalAmount += price;
  /* 
  // total amount and find amount
  // coupon check - DB
  // finalAmount = totalAmount - discount
  */
  let finalAmount;
  const coupon = await Coupon.findById(couponId);
  let discount = (totalAmount * coupon.discount) / 100;
  if (coupon.active) {
    finalAmount = totalAmount - discount;
  }
  finalAmount = totalAmount;

  const { userId } = req.params;

  const options = {
    amount: Math.round(totalAmount * 100),
    currency: "INR",
    receipt: `receipt_${new Date().getTime}`,
  };

  const order = await razorpay.orders.create(options);

  // if order does not exist
  // success then, send it to front end

  const createtOrder = await Order.create({
    user: userId,
    address,
    phoneNumber,
    amount: finalAmount,
    coupon: coupon.code,
  });
  res.status(200).json({
    success: true,
    message: "Order Placed Successfully",
    createtOrder,
  });
});
