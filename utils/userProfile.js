var connectionDB = require('./../utils/connectionDB');
var userModel = require('../model/user');
var uConnectionModel = require('../model/userconnection');

//Connection to Mongoose
var mongoose = require('mongoose');
var musicDB = 'mongodb://localhost/musicDB';
var Schema = mongoose.Schema;
mongoose.connect(musicDB, { useNewUrlParser: true, useUnifiedTopology: true });

//User profile model for the user's saved connections
var userProfileModel = mongoose.model('userConnection', new Schema({
  userID: String,
  connectionId: String,
  category: String,
  name: String,
  rsvp: String
}));

/*
var defaultUser = [{userId : "1",
 firstname : "Rohan",
 lastname : "Sriram",
 email : "rohansriram@djmag.com",
 city : "charlotte",
 state: "NC",
 zipcode:"28262",
 country:"USA"
}]
*/

//Add a new connection to the saved connections of the user
var addConnection = async function(connectionId,userId, action) {
  var conn = await connectionDB.getConnection(connectionId);
  var userConnection = new userProfileModel({
    userID: userId,
    connectionId: conn.workshopId,
    category: conn.topic,
    name: conn.name,
    rsvp: action
  });
  // save the connection
  
  await userConnection.save();
  return userConnection;
}

//Delete connection to the saved connections of the user
var removeConnection = async function(connectionID) {
  console.log(connectionID);
  userProfileModel.remove({connectionId: connectionID}, function(err) {
        if (err) 
        
        return handleError(err);
    });
}


//Update RSVP of an existing user connections
var updateRSVP = async function(userId, connectionId, action) {
  await userProfileModel.findOneAndUpdate({
    userID: userId,
    connectionId: connectionId
  }, {
     $set: { rsvp: action } }).exec().then((userconnection) => {

    }).catch((err) => {
        console.log(err);
    });
}

//Get the list of user connections for a given userId, i.e MyConnections
var getUserConnectionsForID = async function(userId) {
    var userConnections = [];

    await userProfileModel.find({userID: userId}).exec().then((connections) => {
      connections.forEach((item, index) => {
        userConnection = new uConnectionModel.userconnection(item.userID, item.connectionId, item.category, item.name, item.rsvp);
        userConnections.push(userConnection);
      });
    }).catch((err) => {
        console.log(err);
    });

    return userConnections;
}

/*
module.exports.getUserConnections = function(userConnectionList) {
  
  final = [];
  if (userConnectionList === undefined) {
    return final;
  }

  for (var i = 0; i < userConnectionList.length; i++) {
    conn = userConnectionList[i];
  
  var userConnection = new uConnectionModel.userconnection(conn.userId, conn.connectionId, conn.category, conn.name, conn.rsvp );
  final.push(userConnection);
  }
  return final;

};
*/



module.exports.addConnection = addConnection;
module.exports.updateRSVP = updateRSVP;
module.exports.removeConnection = removeConnection;
module.exports.getUserConnectionsForID = getUserConnectionsForID;
module.exports.userProfile = userProfileModel;
//module.exports.defaultUser = defaultUser;

