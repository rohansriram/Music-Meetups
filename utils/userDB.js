var userModel = require('../model/user');
var userProfile = require('../utils/userProfile');
const validator = require('validator')
const bcrypt = require('bcryptjs')
//connect to mongoose
var mongoose = require('mongoose');
var musicDB = 'mongodb://localhost/musicDB';
var Schema = mongoose.Schema;
mongoose.connect(musicDB, { useNewUrlParser: true, useUnifiedTopology: true });

//creating a model for the user who logs in 
var userDBModel = mongoose.model('User', new Schema({
    userID: String,
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email Address is incorrect!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password should not include the letters password.')
            }
        },
        trim: true
    },
    city : String,
    state: String,
    zipcode: String,
    country: String
}));

//getting the details of the logged in user
var getUser = async function recur(email, password) {
    var user;
   // const defaultUser = await userDBModel.find({email:curuser.email, password:curuser.password}).exec().then();
    //console.log(defaultUser.email);
    //console.log(curuser.email);
    
            await userDBModel.findOne({email:email, password:password}).exec().then((defaultUser) => {
            if(defaultUser == null){
                user = defaultUser;
              }
              else{
                user = new userModel.user(defaultUser.userID, defaultUser.firstName, defaultUser.lastName, defaultUser.email, defaultUser.password, defaultUser.city, defaultUser.state, defaultUser.zipcode, defaultUser.country);
              }
            
            console.log(user);
           
            
         }).catch((err) => {
           console.log(err);
         });
        

     
    return user;
}

module.exports.getUser = getUser;
module.exports.userDB = userDBModel;
