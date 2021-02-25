var connectionDB = require('./../utils/connectionDB');
var express = require('express');
Connection = require('../model/connection');
var router = express.Router();
var uProfileModel = require('./../utils/userProfile');
var userconnectionModel = require('./../model/userconnection');

//Route to handle saved connections page and also to handle update and delete connections for the relavant connections of the user
router.get('/', async function(req, res, next) {

  if (req.session.user == null || req.session.user == undefined) {
    res.redirect('/');
  } 
  
  else {
    if(typeof req.query.id == "undefined" && typeof req.query.action == "undefined"){
      req.session.userconnections = await uProfileModel.getUserConnectionsForID(req.session.user.userId);
      var sessionData = {
        userconnections: req.session.userconnections,
        user: req.session.user
      };
      res.render('saved_connections', {sessionData: sessionData});
    }
    
    else if (typeof req.query.id != "undefined" && typeof req.query.action != "undefined") {
      req.session.userconnections = await uProfileModel.getUserConnectionsForID(req.session.user.userId);
      userId = req.session.user.userId;
      connectionId = req.query.id;
      action = req.query.action;
      let count=0;
      

      for (var i=0;i<req.session.userconnections.length;i++){
        if(req.session.userconnections[i].connectionId==connectionId){
          count++;
        }
      }

      if(count>0){
        for (var i=0;i<req.session.userconnections.length;i++){
          if(req.session.userconnections[i].connectionId==connectionId){
            //console.log("in rsvp update");
              await uProfileModel.updateRSVP(userId, connectionId, action);
              
            }
        }
      }
      
      else if (count==0) {
        //console.log("in new conn");
        await uProfileModel.addConnection(connectionId,userId,action);
        
        }
        //Adding to the saved connections here
      req.session.userconnections = await uProfileModel.getUserConnectionsForID(req.session.user.userId);
      var sessionData = { userconnections: req.session.userconnections, user: req.session.user};
      res.render('saved_connections', {sessionData: sessionData});
      
    }
    
    else if (typeof req.query.delete != "undefined" && typeof req.query.id != "undefined") {
      for(var i=0;i<req.session.userconnections.length;i++){
        if(req.session.userconnections[i].connectionId==req.query.delete ){
          
          await uProfileModel.removeConnection(req.session.userconnections[i].connectionId);
          break;
        }
       }
       req.session.userconnections = await uProfileModel.getUserConnectionsForID(req.session.user.userId);
       var sessionData = {userconnections: req.session.userconnections, user: req.session.user };
       res.render('saved_connections', {sessionData: sessionData});
    }
    
  }
});

module.exports = router;
