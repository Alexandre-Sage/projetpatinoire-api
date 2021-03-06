var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser= require("body-parser");
var path = require('path');
var logger = require('morgan');
var multer = require('multer');
var upload= multer({dest: "./public/images/"})

var indexRouter = require('./routes/index');
var forumRouter = require('./routes/forum');
var usersRouter= require("./routes/usersProfils");
var chatRouter= require("./routes/chat");
var inscriptionRouter= require("./routes/inscription");
var usersImagesRouter= require("./routes/usersImages");
//var othersProfilsRouter= require("./routes/othersProfils");
//var othersProfilsImagesRouter= require("./routes/othersProfilsImages");

var app = express();
var cors = require('cors'); /*Ajout et configuration de cors pour autoriser l'appli react a fetcher l'api*/
app.use(cors({
                origin:  true/*["http://localhost:3000", "http://localhost:19002" , "*" ]*/,
                credentials: true,
                preflightContinue: true,
                //allowedHeaders: true//["http://localhost:3000", "http://localhost:19002"]
            })); //credential pour l'upload des photos et des cookies
// view engine setup
//test ajout cors
/*app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000", "http://localhost:19006/" );
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});*/
//test ajout cors
app.use(cookieParser("secret"));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public/images', express.static(path.join(__dirname, './public/images')));

app.use('/', indexRouter);
app.use('/forum', forumRouter);
app.use('/users', usersRouter);
app.use("/chat", chatRouter);
app.use("/inscription", inscriptionRouter);
app.use("/usersImages", usersImagesRouter);
//app.use("/othersProfils", othersProfilsRouter);
//app.use("/othersProfilsImages", othersProfilsImagesRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
