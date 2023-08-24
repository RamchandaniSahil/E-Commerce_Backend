const Product = require("../models/product.schema");
const formidable = require("formidable");
const fs = require("fs");
const { deleteFile, uploadFile } = require("../services/imageUpload");
const Mongoose = require("mongoose");
const asyncHandler = require("../services/asyncHandler");
const CustomError = require("../utils/customError");
const config = require("../config/index");

/***************************************************
 * @ADD_PRODUCT
 * @route http://localhost:4000/api/product/add
 * @description Controller used for creating new product
 * @description Only admin can create the coupon
 * @description Uses Coludinary
 * @return Product Object
 ****************************************************/

exports.addProduct = asyncHandler(async (req, res) => {
  // const form = formidable({
  //   multiples: true,
  //   keepExtensions: true,
  // });

  const form = new formidable.IncomingForm();

  form.parse(req, async function (err, fields, files) {
    try {
      // console.log("fields = ", fields.price.toString());
      // console.log("files = ", files);
      if (err) {
        throw new CustomError(err || "Something went wrong", 500);
      }

      if (
        !fields.name ||
        !fields.price ||
        !fields.description ||
        !fields.collectionId
      ) {
        throw new CustomError("Please fill all the details", 500);
      }

      let file = files.photos;
      //   console.log("File = ", file);
      let products;

      for (let i = 0; i < file.length; i++) {
        const path = file[i].filepath;
        // console.log("PATH = ", path);
        const upload = await uploadFile(`${path}`);
        // console.log("upload = ", upload);
        products = await Product.create({
          name: fields.name.toString(),
          price: fields.price.toString(),
          description: fields.description.toString(),
          photos: { secure_url: upload },
          stock: fields.stock.toString(),
          collectionId: fields.collectionId.toString(),
        });
      }

      if (!products) {
        throw new CustomError("Product was not created", 400);
      }
      res.status(200).json({
        success: true,
        products,
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
exports.getAllProducts = asyncHandler(async (req, res) => {
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
 * @route http://localhost:4000/api/product/:id
 * @description Controller used for gatting single product details
 * @description User and admin can get single product details
 * @return Products Object
 ****************************************************/
exports.getProductById = asyncHandler(async (req, res) => {
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
