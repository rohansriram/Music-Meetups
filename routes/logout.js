var express = require('express');
var router = express.Router();

//Routing to logout
router.get('/', function(req, res, next) {
    if (req.session.user == null) {
      res.render('index');
    } 
    
    else {
      req.session.user = null;
      res.render('index');
    }
  });
  
module.exports = router;
