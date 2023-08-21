import Product from "../models/product.schema";
import formidable from "formidable";
import fs from "fs";
import { deleteFile, uploadFile } from "../services.imageUpload";
import Mongoose from "mongoose";
import asyncHandler from "../services/asyncHandler";
import CustomError from "../utils/customError";
import config from "../config/index";

/***************************************************
 * @ADD_PRODUCT
 * @route http://localhost:4000/api/product
 * @description Controller used for creating new product
 * @description Only admin can create the coupon
 * @description Uses Coludinary
 * @return Product Object
 ****************************************************/

export const addProduct = asyncHandler(async (req, res) => {
  const form = formidable({
    multiples: true,
    keepExtensions: true,
  });

  form.parse(req, async function (err, fields, files) {
    try {
      if (err) {
        throw new CustomError(err.message || "Something went wrong", 500);
      }
      // const productId = new Mongoose.Types.ObjectId().toHexString();
      //   console.log(fields, files);

      // Check for fields
      if (
        !fields.name ||
        !fields.price ||
        !fields.description ||
        !fields.collectionId
      ) {
        throw new CustomError("Please fill all the details", 500);
      }

      // handling images
      let imgArrayRes = Promise.all(
        Object.keys(files).map(async (fileKey, index) => {
          const element = files[fileKey];

          const data = fs.readFileSync(element.filePath);

          const upload = await uploadFile({
            // bucketName: config.BUCKET_NAME,
            // key: `products/${productId}/photo_${index + 1}.png`,
            body: data,
            // contentType: element.mimetype,
          });
          return {
            secure_url: upload.Location,
          };
        })
      );

      let imgArray = await imgArrayRes;

      const product = await Product.create({
        // _id: productId,
        photos: imgArray,
        ...fields,
      });

      if (!product) {
        throw new CustomError("Product was not created", 400);
      }
      res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Something went weont",
      });
    }
  });
});

/***************************************************
 * @GET_ALL_PRODUCT
 * @route http://localhost:4000/api/product
 * @description Controller used for gatting all products details
 * @description User and admin can get all the products
 * @return Products Object
 ****************************************************/
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});

  if (!products) {
    throw new CustomError("No product was found", 404);
  }

  res.status(200).json({
    success: true,
    products,
  });
});

/***************************************************
 * @GET_PRODUCT_BY_ID
 * @route http://localhost:4000/api/product
 * @description Controller used for gatting single product details
 * @description User and admin can get single product details
 * @return Products Object
 ****************************************************/
export const getProductById = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findById(productId);

  if (!product) {
    throw new CustomError("No product was found", 404);
  }

  res.status(200).json({
    success: true,
    product,
  });
});
