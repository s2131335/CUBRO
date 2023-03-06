const multer = require("multer");

var storage = multer.diskStorage({
	// set local destination
	destination: function (req, file, cb) {
		cb(null, "uploads");
	},
	filename: function (req, file, cb) {
		let filename = req.body.filename;
		cb(null, file.originalname);
	},
});

var uploads = multer({
	storage: storage, //enable it if local storage is needed
});

module.exports = uploads.single("file");
