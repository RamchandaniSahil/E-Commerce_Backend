const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Provide a category name"],
      trim: true,
      maxLength: [
        120,
        "Collection name should not be more then 120 characters",
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Collection", collectionSchema);
