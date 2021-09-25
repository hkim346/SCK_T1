var createError = require('http-errors');
var express = require('express');
var path = require('path');
const mongoose = require('mongoose');
const layouts = require('express-ejs-layouts'); 
require('dotenv').config();
var indexRouter = require('./routes/index');
var actionRouter = require('./routes/action');
var recordRouter = require('./routes/records')
var HTTP_PORT = process.env.PORT || 8080;
var app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Static Files
app.use(express.static('public'));



//database connection
mongoose.connect(process.env.DB_CONNECTION).then(()=>console.log('Connected to Database'))
  .catch(err => console.log(err));


// view engine setup
app.use(layouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/action', actionRouter)
app.use('/records', recordRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(HTTP_PORT);
module.exports = app;

