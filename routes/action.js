
var express = require('express');
var router = express.Router();
const Action = require('../models/action');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'imgfileDB/');
  },
  filename: function (req, file, cb) {
    cb(null, req.user.email+'-'+ Date.now() + '-' + file.originalname);
  }
});
var upload = multer({ storage: storage });


router.get('/', isLoggedin, async function (req, res, next) {
  res.render('action');
});


router.post('/addaction', upload.single('image'),isLoggedin, async function (req, res, next) {
  
  const { name, repeat } = req.body;
  var pointPeraction = name.split(',')[0];
  var actionName = name.split(',')[1];
  var totalpoint = pointPeraction*repeat;
  const userid = req.user.id;
  var action = new Action({name: actionName, pointvalue: pointPeraction, repeat: repeat, totalPoint: totalpoint, userid: userid, imgurl:req.file.path, date: Date.now()})
  action.save();
  res.redirect('/records');
});


function isLoggedin(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }

  res.redirect('/login');
}
function isLoggedout(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/')
  }
  next()
}

module.exports = router;
