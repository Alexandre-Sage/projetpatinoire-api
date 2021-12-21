var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser= require("body-parser"); //ajouter pour upload photo verifier utiliter

var indexRouter = require('./routes/index');
var forumRouter = require('./routes/forum');
var usersRouter= require("./routes/usersProfils");
var chatRouter= require("./routes/chat");
var inscriptionRouter= require("./routes/inscription");

var uploadTestRouter= require("./routes/upload");

var app = express();
var cors = require('cors'); /*Ajout et configuration de cors pour autoriser l'appli react a fetcher l'api*/
app.use(cors({origin: "http://localhost:3000",
                credentials: true}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cookieParser("secret"));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public/images', express.static(path.join(__dirname, './public/images')));
 //ajout pour authToken
//app.use(express.static("public"))

app.use('/', indexRouter);
app.use('/forum', forumRouter);
app.use('/users', usersRouter);
app.use("/chat", chatRouter);
app.use("/inscription", inscriptionRouter);
app.use("/upload", uploadTestRouter)
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
