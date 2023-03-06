let createError = require("http-errors");
let express = require("express");
let path = require("path");
let logger = require("morgan");
const passport = require("passport");
const cors = require("cors");
require("dotenv").config({ path: `${__dirname}/.env` });

// Routers
let usersRouter = require("./routes/users");
let testingRouter = require("./routes/testing");
let coursesRouter = require("./routes/courses");

//
let app = express();
app.use(
    cors({
        origin: "http://localhost:" + process.env.FRONTEND_PORT,
        credentials: true,
    })
);

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
