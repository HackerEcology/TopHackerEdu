var User, mongoose, newUser, Invitation;
var crypto = require('crypto');
var uuid = require('node-uuid');
var redis = require('redis');
var mail = require('./mail');

var _ = require('lodash');
mongoose = require("mongoose");

var redisClient = redis.createClient();

User = mongoose.model("User", {
  _id: String,
  email: String,
  password: String,
  fullname: String,
  joined_at: {type:Date, default:Date.now}
});

var hashPassword = function(password){
  //return 2*password;
  var md5 = crypto.createHash('md5');
  return md5.update(password).digest('base64');
};

var newUser = function(req, res, next) {
  //var user;
  var passwordHash = hashPassword(req.param('password'));
  //var email_code = req.param('email_code');
  var newUser = new User({
    _id: req.param('user_id'),
    email: req.param('email'),
    password: passwordHash,
    //state: 'unverified'
  });
  
  User.findOne({"$or":[{user_id : newUser.user_id}, {email : newUser.email}]}, function(err, user){
        if (user){
          var user_exist_err = 'Username or email already exists.';
          res.json(400, {error: user_exist_err});
          console.log(user_exist_err);
          return;
        }
        if (err){
          console.log(err);
        }
        newUser.save(function(err){
          if (err){
            return console.log(err);
          }
        });
        var access_token = uuid.v4();
        //access_token_store[newUser.user_id] = access_token;
        res.json(201,{success: "user_is_created" , user_id: newUser.user_id, access_token: access_token});
            return;
  });
};

var listUser = function(req, res, next){
    User.find({ },null,
        function(err, users){
        if(!err){
            return res.send(users);
        }
        else{
            return console.log(err);
        }
    });
};

exports.newUser = newUser;
exports.listUser = listUser;

exports.User = User;
exports.hashPassword = hashPassword;
