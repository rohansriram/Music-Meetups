var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
let connection = require('./routes/controller.js');
let login = require('./routes/login.js');
let logout= require('./routes/logout.js');
let user = require('./routes/profileController.js');

app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));
app.use(session({secret: 'rohansriram',
                saveUninitialized: true,
                resave: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use('/',connection);
app.use('/login',login);
app.use('/logout',logout);
app.use('/userConnections',user);
app.use('/*',connection);


app.listen(8084,function(){
    console.log('listening on port 8084')
});
