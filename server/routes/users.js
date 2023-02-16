const express = require('express');
const router = express.Router();
const validation = require('../middlewares/validations/userValidation');
const {addUser,login,logout} = require('../controllers/users');
const checkAuth = require('../middlewares/auth');
const Auth = require('../middlewares/auth');

router.post('/login', login);

router.post('/register',validation.register,addUser);

router.get('/logout',Auth.checkAuth(Auth.TUTOR),logout);




module.exports = router;
