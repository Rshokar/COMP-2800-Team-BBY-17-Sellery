/**
   * Uploading/storing images in MongoDB using Node.js, express
   * & Multer
   * I found this code on bezcoder.com
   *
   * @author bezcoder
   * @see https://bezkoder.com/node-js-upload-store-images-mongodb/#Source_Code
   */

const express = require("express");
const router = express.Router();
const homeController = require("../functions/home");
const uploadController = require("../functions/upload");

let routes = app => {
    router.get("/", homeController.getHome);

    router.post("/upload", uploadController.uploadFiles);

    return app.use("/", router);
};

module.exports = routes;