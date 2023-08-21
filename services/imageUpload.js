// import Cloudinary from "../config/cloudinary.config";
const cloudinary = require("cloudinary").v2;

export const uploadFile = async ({ body }) => {
  return await cloudinary.uploader
    .upload(body)
    .then((result) => console.log("Success", JSON.stringify(result, null, 2)))
    .catch((error) => console.log("Error", JSON.stringify(error, null, 2)));
};

export const deleteFile = async ({ body }) => {
  return await cloudinary.uploader
    .destroy(body)
    .then((result) => console.log(result));
};
