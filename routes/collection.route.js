const express = require("express");
const {
  createCollerction,
  updateCollection,
  deleteCollection,
  getAllCollection,
} = require("../controllers/collection.controller");
const router = express.Router();

router.get("/", getAllCollection);
router.post("/create", createCollerction);
router.put("/update/:id", updateCollection);
router.delete("/delete/:id", deleteCollection);

module.exports = router;
