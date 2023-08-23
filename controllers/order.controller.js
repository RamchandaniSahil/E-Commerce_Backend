import Product from "../models/product.schema";
import Coupon from "../models/coupon.schema";
import Order from "../models/order.schema";
import asyncHandler from "../services/asyncHandler";
import CustomError from "../utils/customError";
import razorpay from "../config/razorpay.config";

/***************************************************
 * @GENERATE_RAZORPAY_ID
 * @route http://localhost:4000/api/ouder/razorpay
 * @description Controller used for generating razorpay ID
 * @description Create a razorpay ID which is used for placing order
 * @return Order Object with "Razorpay  order id generated successfully"
 ****************************************************/

export const generateRazorpayOrderId = asyncHandler(async (req, res) => {
  /* 
  // get product and coupon from frontend
  */
  /* 
  // verfiy product price from backend
  // make DB query to get all products and info
  */
  let totalAmount;
  /* 
  // total amount and find amount
  // coupon check - DB
  // finalAmount = totalAmount - discount
  */

  const options = {
    amount: Math.round(totalAmount * 100),
    currency: "INR",
    receipt: `receipt_${new Date().getTime}`,
  };

  const order = await razorpay.orders.create(options);

  // if order does not exist
  // success then, send it to front end
});
