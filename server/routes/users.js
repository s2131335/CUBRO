const express = require("express");
const router = express.Router();
const validation = require("../middleware/validations/userValidation");
const {
	register,
	login,
	logout,
	showStudents,
	changePassword,
	addRoles,
	resetPassword,
	forgetPassword,
	activateAccount,
	addUser,
} = require("../controllers/users");
const Auth = require("../middleware/auth");

router.post("/login", login);

router.post("/register", validation.register, validation.password, register);

router.post("/add-user", Auth.checkAuth(Auth.ADMIN), addUser);

router.post("/logout", logout);

router.post(
	"/update-password",
	Auth.checkAuth(),
	validation.password,
	changePassword
);

router.get("/show-students", Auth.checkAuth(Auth.ADMIN), showStudents);

router.post("/add-roles", Auth.checkAuth(Auth.ADMIN), addRoles);

router.post("/forget", forgetPassword);

router.post("/reset-password/:token", resetPassword);

router.get("/activate-account/:token", activateAccount);

module.exports = router;
