const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const authRoute = require("./routes/auth.route");
const collectionRoute = require("./routes/collection.route");
const productRoute = require("./routes/product.route");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// morgon logger
app.use(morgan("tiny"));
app.use("/api/auth", authRoute);
app.use("/api/collection", collectionRoute);
app.use("/api/product", productRoute);

module.exports = app;
