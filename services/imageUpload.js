const cloudinary = require("cloudinary").v2;
const configs = require("../config/index");

exports.uploadFile = async (body) => {
  cloudinary.config({
    cloud_name: configs.CLOUDINARY_CLOUD_NAME,
    api_key: configs.CLOUDINARY_API_KEY,
    api_secret: configs.CLOUDINARY_API_SECREAT,
    secure: true,
  });
  await cloudinary.uploader
    .upload(body)
    .then((result) => {
      // console.log("Success", result.secure_url);
      // console.log(result.secure_url);
      url = result.secure_url;
    })
    .catch((error) => console.log("Error", JSON.stringify(error, null, 2)));
  return `${url}`;
};

exports.deleteFile = async ({ body }) => {
  return await cloudinary.uploader
    .destroy(body)
    .then((result) => console.log(result));
};
