/**
   * Uploading/storing images in MongoDB using Node.js, express
   * & Multer
   * I found this code on bezcoder.com
   *
   * @author bezcoder
   * @see https://bezkoder.com/node-js-upload-store-images-mongodb/#Source_Code
   */


const util = require("util");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

var storage = new GridFsStorage({
    url: "mongodb+srv://testing:gcX9e2D4a4HXprR0@sellery.4rqio.mongodb.net/sellery?retryWrites=true&w=majority",
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg"];

        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-shawn-${file.originalname}`;
            return filename;
        }

        return {
            bucketName: "photos",
            filename: `${Date.now()}-shawn-${file.originalname}`
        };
    }
});

var uploadFiles = multer({
    storage: storage
}).array("multi-files", 10);
// var uploadFiles = multer({ storage: storage }).single("file");
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;