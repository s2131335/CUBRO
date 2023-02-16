const userService = require('../services/users');
const error = require('../utils/errors')
const passport = require('passport');
const Auth = require('../middlewares/auth');
const { validationResult } = require('express-validator');



module.exports.login = function (req, res, next) {
    if (req.isAuthenticated()) return res.status(200).send("Login");
  
    passport.authenticate('local', function (err, user, info) {
      if (err) {
        return next(err);
      }
      // if no user is returned by passport
      if (!user) {
        return res.send(error[info]);
      }
  
      // login
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        // console.log(req.user);
        return res.status(200).send('Login');
      });
    })(req, res, next);
}

module.exports.addUser = async function (req,res){
    let err = validationResult(req);
    if (err.errors.length !== 0)
    {   
        let validatorError = err.errors[0].msg;
        return res.status(error[validatorError].status).send(error[validatorError]);
    }

    const userData = req.body;
    try 
    {
        await userService.addUser(userData);
    }
    catch (err)
    {
      if (error[err])   // if error contain the catched error, send the error
            return res.status(error[err].status).send(error[err]);
        // else send UnknownError
        return res.status(error.Unknown.status).send(error.Unknown);
    }
    res.status(200).send('ok');

}

module.exports.logout = function(req, res, next){
    req.logout(function(err) {
        if (err) { return next(err); }
        res.send('Logout');
    });
}

module.exports.showTutors = async function(req, res, next){
  let tutors = await userService.findAllUserByFilter({"role":Auth.TUTOR});
  res.status(200).json(tutors);
}

module.exports.showAdmins = async function(req, res, next){
  let admins = await userService.findAllUserByFilter({"role":Auth.ADMIN});
  res.status(200).json(admins);
}

module.exports.showAllUsers = async function(req, res, next){
  let Users = await userService.findAllUserByFilter();
  res.status(200).json(users);
}
