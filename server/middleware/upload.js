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

var uploadLocal = multer({
	storage: storage, //enable it if local storage is needed
});

var uploadDb = multer({
	// storage: storage, //enable it if local storage is needed
});

module.exports.uploadLocal = uploadLocal.single("file");
module.exports.uploadDb = uploadDb.single("file");
