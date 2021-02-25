var connectionDB = require('./../utils/connectionDB');
var express = require('express');
var router = express.Router();
Connection = require('../model/connection');
var { check, validationResult } = require('express-validator');


//post request from new connection to connections page by validating each input
router.post('/connections',
[
  check('topic').isAlphanumeric().withMessage('Topic: Only Alphanumeric characters allowed.').trim()
    .escape(),
  check('name').isAlphanumeric().withMessage('Name: Only Alphanumeric characters allowed.').trim()
    .escape(),
  check('details').isAlphanumeric().withMessage('Details: Space/Special characters are not allowed.').trim()
    .escape(),
  check('venue').isAlphanumeric().withMessage('Venue: Only Alphanumeric characters allowed.').trim()
    .escape(),
  check('date').isAfter(new Date().toDateString()).withMessage('Date: Only dates in future allowed.')
  //time
],
async function(request,response){
  var errors = validationResult(request);
  if (!errors.isEmpty()) {
    var sessionData = {
      user: request.session.user
    };
    response.render('newConnection',{sessionData: sessionData, errors:errors.array()});
  } else{
    await connectionDB.addNewConnection(request.body, request.session.user.userId);
    response.redirect('/connections');
  }
});

// Default page which is loaded
router.get('/', function(request, response) {
  if (request.session.user !== undefined) {
    var sessionData = {
      user: request.session.user
    };
    response.render('index', {sessionData: sessionData});
  } else {
    response.render('index');
  }
});
// Connection page routing with corresponding rendering 
router.get('/connection', async function(request, response) {
  if (request.query.length === 0) {
    var sessionData = {
      categoryTopics: await connectionDB.categoryTopics(),
      connections: await connectionDB.getConnections(),
      user: request.session.user
    }
    response.render('connections', { sessionData : sessionData});
  } else if (Object.keys(request.query).length === 1) {
      if (Object.keys(request.query)[0] === 'connectionID') {
          var connectionID = request.query.connectionID;
          var ids = await connectionDB.ids();
          //console.log(ids);
          if(ids.includes(connectionID)) {
            var connectionObj = await connectionDB.getConnection(connectionID);
            var sessionData = {
              connection: connectionObj,
              user: request.session.user
            }
            response.render('connection', { sessionData : sessionData});
          } else {
            response.status(404).send("Page Not found.");
          }
      } else {
        var sessionData = {
          categoryTopics: await connectionDB.categoryTopics(),
          connections: await connectionDB.getConnections(),
          user: request.session.user
        }
      // console.log(sessionData);
        response.render('connections', { sessionData : sessionData});
      }
  }
});

// index routing using sessions
router.get('/index', function(request, response) {
  if (request.session.user !== undefined) {
    var sessionData = {
      user: request.session.user
    };
    response.render('index', {sessionData: sessionData});
  } else {
    response.render('index');
  }
});

// about routing using sessions
router.get('/about', function(request, response) {
  if (request.session.user !== undefined) {
    var sessionData = {
      user: request.session.user
    };
    response.render('about', {sessionData: sessionData});
  } else {
    response.render('about');
  }
});

// contact routing using sessions
router.get('/contact', function(request, response) {
  if (request.session.user !== undefined) {
    var sessionData = {
      user: request.session.user
    };
    response.render('contact', {sessionData: sessionData});
  } else {
    response.render('contact');
  }
});

// Connections routing using sessions
router.get('/connections', async function(request, response) {
  if (request.session.user !== undefined) {
    var sessionData = {
      categoryTopics: await connectionDB.categoryTopics(),
      connections: await connectionDB.getConnections(),
      user: request.session.user
    }
    response.render('connections', {sessionData: sessionData});
  }else {
    var data = {
      categoryTopics: await connectionDB.categoryTopics(),
      connections: await connectionDB.getConnections()
    }
    response.render('connections', {sessionData: data});
  }
});

// Starting a new connection using sessions
router.get('/newConnection', function(request, response) {
  if (request.session.user !== undefined) {
    var sessionData = {
      user: request.session.user
    };
    response.render('newConnection', {sessionData: sessionData, errors: null});
  } else {
    response.render('newConnection', {errors: null});
  }
});


module.exports = router;
