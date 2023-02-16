const userService = require('../services/users');
const error = require('../utils/errors')
const passport = require('passport');
const Auth = require('../middlewares/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const {sendMail} = require('../utils/sendMail');



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
    // console.log(err);
    if (err.errors.length !== 0)
    {   
      let validatorError = error[err.errors[0].msg];
      if (validatorError)
        return res.status(validatorError.status).send(validatorError);
      else return res.status(error.Unknown.status).send(err.errors[0].msg);
    }

    let userData = req.body;
    delete userData.password2;
    try 
    {
        await userService.addUser(userData);
    }
    catch (err)
    {
      if (error[err])   // if error contain the catched error, send the error
            return res.status(error[err].status).send(error[err]);
        // else send UnknownError
        return res.status(error.Unknown.status).send(err);
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
  let users = await userService.findAllUserByFilter();
  res.status(200).json(users);
}

module.exports.updatePassword = async function(req, res, next){
  let err = validationResult(req);
  if (err.errors.length !== 0)
  {  
    // console.log(err);
    let validatorError = error[err.errors[0].msg];
    if (validatorError)
      return res.status(validatorError.status).send(validatorError);
    else return res.status(error.Unknown.status).send(err.errors[0].msg);
  }
  // let id = (!req.body.id)? req.user._id: req.body.id;
  let hash = await bcrypt.hash(req.body.password,10);
  let users = await userService.findUserAndUpdate({"_id":req.user._id},{"password": hash });
  res.status(307).redirect('logout');
}

module.exports.addRoles = async function(req, res, next){
  let roles = req.body.id;
  roles.push(req.body.newRole);
  let users = await userService.findUserAndUpdate({"_id":req.user._id},{"role":newRole});
  res.status(307).redirect('logout');
  
}

module.exports.forget = async function (req,res){
  let email = req.body.email;
  let user = await userService.findOneByFilter({email});
  if(!user)
    return res.status(error.UserNotFound.status).send(error.UserNotFound);

    const token = jwt.sign({_id: user._id}, 'resetkey', {expiresIn: '10m'});
    // console.log(token);
    let err = await userService.findUserAndUpdate({id: user._id},{resetlink: token});
    if (err) 
      return res.status(500).send(err);



    try
    {
      await sendMail(email,{"mode":"resetpw","payload":token});
    }
    catch(err)
    {
      console.log(err)
      return res.status(error.FailToSendMail.status).send(error.FailToSendMail);
    }

  return res.status(200).send("ok");

    




  
  
}