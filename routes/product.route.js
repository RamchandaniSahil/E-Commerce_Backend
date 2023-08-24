const express = require("express");
const {
  getAllProducts,
  addProduct,
  getProductById,
} = require("../controllers/product.controller");
const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/add", addProduct);

module.exports = router;
