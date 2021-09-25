
var express = require('express');
var router = express.Router();
const Record = require('../models/action');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();



  
function createDataUrl(filepath) {
    // read binary data
    try{
      var bitmap = fs.readFileSync(filepath);
    }
    catch{
      return null;
    }
    // create img data url
    var ext = filepath.split('.').pop();
    return 'data:image/'+ext+';base64,'+bitmap.toString('base64');
  }

router.get('/', isLoggedin, async function (req, res, next){
    const records = await Record.find({userid:req.user.id})

    var clientRecords = [];
  var count=0;
  records.forEach((record)=>{
      var recordClass={
      id: record.id,
      name: record.name,
      pointvalue: record.pointvalue,
      repeat: record.repeat,
      totalpoint: record.totalPoint,
      date: record.date.toLocaleDateString(),
      dataUrl: createDataUrl(record.imgurl),
      filepath: record.imgurl,
      imgid: 'pic'+count
      }
      count++;
      clientRecords.push(recordClass);
   })
    res.render('records', {records: clientRecords});
  });


router.post('/deleterecord', isLoggedin, async function (req, res, next) {
    await Record.findByIdAndDelete(req.body.id);
    fs.unlink(req.body.imgurl,(err)=>{
      if(err){
        console.log(err);
      }
    });
    res.redirect('/action');
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
