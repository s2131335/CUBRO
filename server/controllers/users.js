const userService = require('../services/users');
const error = require('../utils/errors')
const passport = require('passport');
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
        console.log(err);
        if (err.code==11000) // email exist
            return res.status(error.EmailExist.status).send(error.EmailExist);

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

