const express = require("express");
const router = express.Router();
const validation = require("../../middleware/validations/userValidation");
const {
	register,
	login,
	logout,
	getUserProfile,
	changePassword,
	modRoles,
	resetPassword,
	forgetPassword,
	activateAccount,
	addUser,
	showUsers,
	deleteUser,
	resetUserPassword
} = require("../../controllers/users");
const Auth = require("../../middleware/auth");

router.post("/login", login);

router.post("/register", validation.register, validation.password, register);

router.post("/add-user", Auth.checkAuth(Auth.ADMIN), addUser);

router.get("/logout", Auth.checkAuth(), logout);

router.post(
	"/update-password",
	Auth.checkAuth(),
	validation.password,
	changePassword
);

router.post("/reset-user-password/:id",Auth.checkAuth(Auth.ADMIN),validation.password,resetUserPassword);

// router.get("/show-students", Auth.checkAuth(Auth.ADMIN), showStudents);

router.get("/get-current-user", Auth.checkAuth(), getUserProfile);

router.post("/show-users", Auth.checkAuth(Auth.ADMIN), showUsers);

router.post("/delete-user", Auth.checkAuth(), deleteUser);

router.post("/modify-role", Auth.checkAuth(Auth.ADMIN), modRoles);

router.post("/forget", forgetPassword);

router.post("/reset-password/:token", resetPassword);

router.get("/activate-account/:token", activateAccount);

module.exports = router;
