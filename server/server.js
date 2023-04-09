let createError = require("http-errors");
const { readJSON } = require("./utils/utils");
let express = require("express");
let path = require("path");
let logger = require("morgan");
const passport = require("passport");
const cors = require("cors");
require("dotenv").config({ path: `${__dirname}/.env` });
const Auth = require("./middleware/auth");

///////////////// setup global //////////////////
let CUBRO = {};
global.CUBRO = CUBRO;
try {
	global.CUBRO.CourseFile = readJSON(path.join(__dirname, "courses.json"));
} catch (err) {
	if (err.code === "ENOENT") {
		global.CUBRO.CourseFile = {};
		console.log("Create courses.json");
	}
}

global.CUBRO.TIMESLOTS = [
	"08:30-09:30", //0
	"09:30-10:30",
	"10:30-11:30",
	"11:30-12:30",
	"12:30-13:30",
	"13:30-14:30",
	"14:30-15:30",
	"15:30-16:30",
	"16:30-17:30",
	"17:30-18:30",
	"18:30-19:30",
	"19:30-20:30",
	"20:30-21:30", //12
];

/////////////// complete global setup //////////////////////////////////
// view engine setup
let app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Routers
let usersRouter = require("./routes/api/users");
let testingRouter = require("./routes/api/testing");
let coursesRouter = require("./routes/api/courses");

var loginregRouter = require("./routes/loginreg");
var internalRouter = require("./routes/internal");
var tableRouter = require("./routes/timetable");
var adminRouter = require("./routes/admin");

//
// app.use(
// 	cors({
// 		origin: [
// 			"http://localhost:" + process.env.FRONTEND_PORT,
// 			"http://127.0.0.1:" + process.env.FRONTEND_PORT,
// 		],
// 		credentials: true,
// 	})
// );

const bodyParser = require("body-parser");
const session = require("express-session");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	session({
		secret: process.env.SECRET,
		sameSite: "none",
		resave: "false",
		saveUninitialized: "false",
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
			secure: false,
			httpOnly: true,
		},
	})
);

//Passport
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);
//

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", usersRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/testing", testingRouter);

app.use("/", loginregRouter);
app.use("/internal", internalRouter);
app.use("/table", tableRouter);
app.use("/admin", adminRouter);

/* GET redirect login page*/
app.get("/redirect_login", function (req, res, next) {
	res.render("public/redirect_login", { title: "Redirect Login" });
});

/* GET redirect home page*/
app.get("/redirect_home", Auth.checkAuth(), function (req, res, next) {
	res.render("public/redirect_home", { title: "Redirect Home" });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// render the error page
	console.log(err);
	res.status(err.status || 500);
	res.send("error");
});

module.exports = app;
