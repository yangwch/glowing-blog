var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var util = require("util");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var helpers = require('express-helpers');
var fs = require('fs');
var accessLogfile = fs.createWriteStream("access.log",{flags:"a"});
var errorLogfile = fs.createWriteStream("error.log",{flags:"a"});

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
//var MongoStore = require("connect-mongo");
var settings = require("./settings");

var routes = require('./routes/index');
var users = require('./routes/users');
var hello = require("./routes/hello");
var post = require("./routes/post");
var reg = require("./routes/reg");
var login = require("./routes/login");
var logout = require("./routes/logout");
var h5 = require("./routes/h5");
var calendar = require("./routes/calendar");

var app = express();




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(helpers());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(partials());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: settings.cookieSecret,store: new MongoStore({ url: 'mongodb://localhost/microblog' })}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
  console.log('Request URL:', req.originalUrl);
  var meta = '[' + new Date() + '] ' + req.url + '  [';
  accessLogfile.write(meta + req.method + ']\n');

  res.locals.user=req.session.user;
  var err = req.session.error;
  var success = req.session.success;
  if(err){
  res.locals.error = err.length ? err : null; req.session.error = null; }
  if(success){
  res.locals.success = success.length ? success : null; req.session.success = null; }

  next();
});


//console.log(global);

app.use('/', routes);
app.use('/u', users);
app.use('/post', post);
app.use("/calendar",calendar);
app.use('/reg', reg);
app.use('/login', login);
app.use('/logout', logout);
app.use('/hello', hello);
app.use("/h5",h5);


// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});*/

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    var meta = '[' + new Date() + '] ' + req.url + '\n';
    errorLogfile.write(meta + err.stack + '\n');
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}



// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  var meta = '[' + new Date() + '] ' + req.url + '\n';
  errorLogfile.write(meta + err.stack + '\n');
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
if(!module.parent){
  app.listen(3000);
  console.log("Express server listening on port 3000 in %s mode",app.settings.env);
}
