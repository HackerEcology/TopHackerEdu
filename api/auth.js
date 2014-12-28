var User = require('./user').User;
var hashPassword = require('./user').hashPassword;
var uuid = require('node-uuid');
var redis = require('redis');
var redisClient = redis.createClient();

var accessToken_store = {};

var getAccessToken = function(req, res, next){
  var passwordHash = hashPassword(req.param('password'));
  User.findOne({_id: req.param('user_id'), password: passwordHash}, function(err, user){
    if(!err) {
      //console.log(user);
      if(user) {
        console.log(user);
        var accessToken = uuid.v4();
        redisClient.set('uat:'+user._id, accessToken);
        res.json(200,{ret:true,msg:'成功登陆',data:user, access_token:accessToken});
        return;
      }else{

        console.log({ret:false,msg:'用户名和密码错误'});
        res.json(400,{ret:false,msg:'用户名和密码错误'});
        return;

      }

    }
  });

};

var auth = function() {
  var middleware = function(req, res, next){
    var userId = req.param('user_id');
    var accessToken = req.param('access_token');
      if(userId && accessToken){

      redisClient.get('uat:'+userId, function(err, reply){
        if(err){
          res.json(500,{});
        }else if(reply){
          if(reply == accessToken){
            next();
          }else{
            res.json(403, {error: "unauthorized"});
          }
        }else{
          res.json(403, {error: "unauthorized"});
        }
      });

    }else{
      res.json(403, {error: "unauthorized"});
    }
  };
  return middleware;
};

var newToken = function(userId) {
  var accessToken = uuid.v4();
  redisClient.set('uat:'+userId, accessToken);
  return accessToken;
};

exports.getAccessToken = getAccessToken;
exports.auth = auth;
exports.newToken = newToken;
