var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();


var User = require("./api/user");

var exec = require('child_process').exec;



app.get('/', function(req, res){
  res.send('hello world');
});

app.post('/user', User.newUser);
app.get('/user', User.listUser);

app.post('/hook',function(req, res){
    
    exec('git pull', function (error, stdout, stderr) {
    // output is in stdout
    });
    res.send('got hook');
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
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
    res.render('error', {
        message: err.message,
        error: {}
    });
});

if (!module.parent) {
  app.listen(3001);
  console.log("Express started at 3001");
}
module.exports = app;
