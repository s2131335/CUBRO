const { body } = require("express-validator");
const error = require("../../utils/errors");
module.exports = {
	register: [
		body("fullName")
			.isLength({ min: 1 })
			.withMessage(error.NameNotValid)
			.escape(),
		body("email").isEmail().withMessage(error.EmailNotValid),
		body("nickname").isLength({ max: 20 }).escape(),
	],
	password: [
		body("password")
			.isLength({ min: 1 })
			.withMessage(error.PasswordTooShort),
	],
	// body('password')
	// .custom(value => {
	//     const regex = /^\S{8,12}$/
	//     const result = value.match(regex)
	//     if (!result) {
	//         throw new Error("PasswordTooShort")
	//     }
	//     return true
	// }),
	// body('password2')
	// .custom((value, { req }) => {
	//     if (value !== req.body.password) {
	//     throw new Error('TwoPasswordNotMatch')
	//   }
	//   return true
	// })
	// newTodo: [
	//   // validate name field
	//   body('name')
	//     .isLength({ min: 1, max: 10 })
	//     .withMessage('Name is required, max 10 letters'),
	//   // check status field
	//   body('status')
	//     .custom(value => {
	//       if (value !== 'done' && value !== 'notDone') {
	//         throw new Error('Please choose a task status')
	//       }
	//       // if status passed validation
	//       return true
	//     }),
	//   // check detail field
	//   body('detail')
	//     .isLength({ max: 60 })
	//     .withMessage('Detail length must be less than 60 words')
	// ],
	// editTodo: [
	//   // validate name field
	//   body('name')
	//     .isLength({ min: 1, max: 10 })
	//     .withMessage('Name is required, max 10 letters'),
	//   // check status field
	//   body('status')
	//     .custom(value => {
	//       if (value !== 'done' && value !== 'notDone') {
	//         throw new Error('Please choose a task status')
	//       }
	//       // if status passed validation
	//       return true
	//     }),
	//   // check detail field
	//   body('detail')
	//     .isLength({ max: 60 })
	//     .withMessage('Detail length must be less than 60 words')
	// ],
};
