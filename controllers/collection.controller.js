const Collection = require("../models/collection.schema");
const asyncHandler = require("../services/asyncHandler");
const CustomError = require("../utils/customError");

/***************************************************
 * @Create_COLLECTION
 * @route http://localhost:4000/api/collection/create
 * @description User signup controller for creating a new user
 * @parameters name, email, password
 * @return User Object
 ****************************************************/
exports.createCollerction = asyncHandler(async (req, res) => {
  // Take name from frontend
  const { name } = req.body;

  if (!name) {
    throw new CustomError("Collection name is required", 400);
  }

  // Add this name to database
  const collection = await Collection.create({
    name,
  });

  // Send this response value to frontend
  res.status(200).json({
    success: true,
    message: "Collection created successfully",
    collection,
  });
});

/***************************************************
 * @Update_COLLECTION
 * @route http://localhost:4000/api/collection/update/:id
 * @description User signup controller for creating a new user
 * @parameters name, email, password
 * @return User Object
 ****************************************************/
exports.updateCollection = asyncHandler(async (req, res) => {
  // exixting value to be updated
  const { id: collectionId } = req.params;

  // new value to get update
  const { name } = req.body;

  if (!name) {
    throw new CustomError("Collection name is required", 400);
  }

  let update = await Collection.findByIdAndUpdate(
    collectionId,
    {
      name,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!update) {
    throw new CustomError("Collection not found", 400);
  }

  // send response to front end
  res.status(200).json({
    success: true,
    message: "Collection updated successfully",
    update,
  });
});

/***************************************************
 * @Delete_COLLECTION
 * @route http://localhost:4000/api/collection/delete/:id
 * @description User signup controller for creating a new user
 * @parameters name, email, password
 * @return User Object
 ****************************************************/
exports.deleteCollection = asyncHandler(async (req, res) => {
  const { id: collectionId } = req.params;

  const collectionToDelete = await Collection.findByIdAndDelete(collectionId);

  if (!collectionToDelete) {
    throw new CustomError("Collection not found", 400);
  }
  // collectionToDelete.remove();
  res.status(200).json({
    success: true,
    message: "Collection delete successfully",
  });
});

/***************************************************
 * @Get_COLLECTION
 * @route http://localhost:4000/api/collection
 * @description User signup controller for creating a new user
 * @parameters name, email, password
 * @return User Object
 ****************************************************/
exports.getAllCollection = asyncHandler(async (req, res) => {
  const collections = await Collection.find();

  if (!collections) {
    throw new CustomError("No Collection found", 400);
  }

  res.status(200).json({
    success: true,
    collections,
  });
});
