var arrayList = require('array-list')
var express = require('express');
var connectionModel = require('../model/connection');
var userProfileModel = require('./../utils/userProfile');
var random = require('random');
// Connection established with mongoose

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var musicDB = 'mongodb://localhost/musicDB';


mongoose.connect(musicDB, { useNewUrlParser: true, useUnifiedTopology: true });


//connection model to establish connections
var connDBModel = mongoose.model('Connection', new Schema({
  workshopId: String,
  topic: String,
  name: String,
  subtitle: String,
  details: String,
  venue: String,
  date: String,
  time: String,
  people: String
}));
// getting the date
var currentDate = function() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '-' + dd + '-' + mm;
  return today;
}

//extracting the category of connections
var categoryTopics = async function() {
  var topicslist = [];

   await connDBModel.find({}).exec().then((conData) => {
    
    conData.forEach((item, index) => {

      if(!topicslist.includes(item.topic)) {
        topicslist.push(item.topic);
      }
    });
  }).catch((err) => {
    console.log(err);
  });
  return topicslist;
};

// extracting the workshop IDs
var ids = async function() {
  var storedId = [];
   await connDBModel.find({}).exec().then((conData) => {
    conData.forEach((item, index) => {
      storedId.push(item.workshopId);
    });
  }).catch((err) => {
    console.log(err);
  });
  return storedId;
};

var getConnections = async function() {
  var connections = [];
   await connDBModel.find({}).exec().then((conData) => {
    conData.forEach((item, index) => {
      var connection = new connectionModel.connection(item.workshopId, item.topic, item.name, item.subtitle, item.details, item.venue, item.date, item.time, item.people);
      connections.push(connection);
    });
  }).catch((err) => {
      console.log(err);
  });

  return connections;
};

var getConnection = async function(id) {
  var connection;
       await connDBModel.findOne({workshopId: id}).exec().then((item) => {
          connection = new connectionModel.connection(item.workshopId, item.topic, item.name, item.subtitle, item.details, item.venue, item.date, item.time, item.people);
      }).catch((err) => {
          console.log(err);
      });

    return connection;
};

//Start a new connection and assigning a workshop ID using random function
var addNewConnection = async function(connection, userId) {
  var id = random.int(0, 200);;
    var newConnection = new connDBModel({
        workshopId: id,
        topic: connection.topic,
        name: connection.name,
        subtitle: connection.subtitle,
        details: connection.details,
        venue: connection.venue,
        date: connection.date,
        time: connection.time,
        people: connection.people
    });
    await newConnection.save();
    //assigning a default RSVP yes
    await userProfileModel.addConnection(id,userId,"YES");
}

module.exports.getConnections = getConnections;
//module.exports.connectionDB = DB;
module.exports.categoryTopics = categoryTopics;
module.exports.ids = ids;
module.exports.getConnection = getConnection;
module.exports.addNewConnection = addNewConnection;
module.exports.connectionDB = connDBModel;
module.exports.currentDate = currentDate;


/*
var DB = [
{
  workshopId : "0.DVLM", topic : "ARTISTS", name : "DIMITRI VEGAS AND LIKE MIKE", subtitle : "Hosted by DJ Shaw", details : "Aim of the day would be to discuss the techniques and signature tunes of DVLM.", venue : "kennedy building", date : "on friday, June, 12th 2021", time : "12:00 AM to 01:00 PM",people : "10"
},
{
  workshopId : "1.Mello", topic : "ARTISTS", name : "MARSHMELLO", subtitle : "Hosted by DJ Ron", details : "Aim of the day would be to discuss the techniques and signature tunes of Marshmello.", venue : "music center, Craver Rd", date : "on friday, June 27th 2025", time : "09:00 AM to 03:00 PM",people : "4"
},
{
  workshopId : "2.Trumpet", topic : "ARTISTS", name : "TIMMY TRUMPET", subtitle : "Hosted by DJ AJ", details : "Aim of the day would be to discuss the techniques and signature tunes of Timmy Trumpet.", venue : "proxima center", date : "on Saturday, May 03rd 2022", time : "10:00 AM to 12:00 PM",people : "8"
},
{
  workshopId : "3.progressive", topic : "GENRES", name : "PROGRESSIVE HOUSE", subtitle : "Hosted by DJ Mag", details : "We would look on the different bass modules, various bpm levels of progressive house with hands-on session.", venue : "spectrum center", date : "on thursday, Nov 10th 2021", time : "12:00 PM to 08:00 PM",people : "18"
},
{
  workshopId : "4.dubstep", topic : "GENRES", name : "DUBSTEP", subtitle : "Hosted by DJ Shaaan", details : "We would look on the different bass modules, various bpm levels of dubstep with hands-on session.", venue : "audio life center", date : "on Friday, Dec 6th 2021", time : "11:00 AM to 05:00 PM",people : "11"
},
{
  workshopId : "5.hardstyle", topic : "GENRES", name : "HARDSTYLE", subtitle : "Hosted by DJ Boss", details : "We would look on the different bass modules, various bpm levels of hardstyle with hands-on session.", venue : "station center", date : "on Monday, Wed 9th 2021", time : "10:00 AM to 06:00 PM",people : "09"
}
]
*/


