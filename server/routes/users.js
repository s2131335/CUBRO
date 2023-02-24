const express = require("express");
const router = express.Router();
const validation = require("../middlewares/validations/userValidation");
const {
	addUser,
	login,
	logout,
	showTutors,
	updatePassword,
	addRoles,
	forget,
	resetPassword,
} = require("../controllers/users");
const checkAuth = require("../middlewares/auth");
const Auth = require("../middlewares/auth");

router.post("/login", login);

router.post("/register", validation.register, validation.password, addUser);

router.get("/logout", Auth.checkAuth(Auth.TUTOR), logout);

router.post(
	"/update-password",
	Auth.checkAuth(),
	validation.password,
	updatePassword
);

router.get("/show-tutors", Auth.checkAuth(Auth.ADMIN), showTutors);

router.post("/add-roles", Auth.checkAuth(Auth.ADMIN), addRoles);

router.post("/forget", forget);

router.post("/reset-password/:token", resetPassword);

module.exports = router;
