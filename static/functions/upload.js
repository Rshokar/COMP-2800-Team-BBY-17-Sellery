/**
   * Uploading/storing images in MongoDB using Node.js, express
   * & Multer
   * I found this code on bezcoder.com
   *
   * @author bezcoder
   * @see https://bezkoder.com/node-js-upload-store-images-mongodb/#Source_Code
   */


const upload = require("../middleware/upload");

const uploadFiles = async (req, res) => {
    try {
        await upload(req, res);
        console.log(req.files);

        if (req.files.length <= 0) {
            return res.send(`Select at least 1 file.`);
        }

        return res.send(`Great success! Files have been uploaded.`);

        // console.log(req.file);

        // if (req.file == undefined) {
        //   return res.send(`You must select a file.`);
        // }

        // return res.send(`File has been uploaded.`);
    } catch (error) {
        console.log(error);

        if (error.code === "UNEXPECTED_FILE") {
            return res.send("Too many files to upload.");
        }
        return res.send(`This is your error when trying to upload too many files: ${error}`);

        // return res.send(`Error when trying upload image: ${error}`);
    }
};

module.exports = {
    uploadFiles: uploadFiles
};