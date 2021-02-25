var express = require('express');
var userProfileModel = require('./../utils/userProfile');
var uModel = require('./../model/userconnection');
var router = express.Router();
var UserDB = require('./../utils/userDB');
var { check, validationResult } = require('express-validator');
var { sanitizer } = require('express-validator');
var passwordValidator = require('password-validator');

// Posting the default user when logged in
router.post('/',

[check('email').isEmail().normalizeEmail().withMessage('Please enter a valid Username'),
  check('password').isLength({min:8}).withMessage('Password should be minimum 8 characters')
 ],


async function(req, res, next) { 
  var errors = validationResult(req);
   if (!errors.isEmpty()) {
     res.render('login',{errors:errors.array()});
   } else{
     req.session.user = await UserDB.getUser(req.body.email, req.body.password);
     if(req.session.user != null){
       req.session.userconnections = await userProfileModel.getUserConnectionsForID(req.session.user.userId);
           //session.userItems=userconnections;
       var sessionData = {
         userconnections: req.session.userconnections,
         user: req.session.user
       };
       res.render('saved_connections', {sessionData: sessionData});
     } else {
       res.render('login',{errors:[{"msg":"User not found. Please enter the correct credentials"}]});
     }
   }
});

// Get the user who logged in
router.get('/', async function(req, res, next) {
  if (req.session.user == null) {
    res.render('login',{errors:null});
  } else {
    if(typeof req.query.id == "undefined" && typeof req.query.action == "undefined"){
      userconnections = await userProfileModel.getUserConnectionsForID(req.session.user.userId);
      req.session.user.userItems=userconnections;
      var sessionData = {
        userconnections: session.userItems,
        user: req.session.user
      };
      res.render('saved_connections', {sessionData: sessionData});
    }
  }
});
/*
router.get('/', function(req, res, next) {
    if (req.session.user == null) {
      res.render('index');
    } else {
      req.session.user = null;
      res.render('index');
    }
  });
  */
  

module.exports = router;
