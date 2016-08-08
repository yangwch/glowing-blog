var express = require('express');
var router = express.Router();

var crypto = require("crypto");
var User = require("../models/user");

/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.session.error){
		res.locals.error = req.session.error;
		req.session.error = null;
	}
	res.render("login",{title:"登录",content:"当前时间为："+(new Date()).toString(),name:"Zhangsan",items:["Orange","Banana","Apple","Potato"]});
});

//登录
router.post("/",function(req,res){
	var form = req.body,pass = req.body["password"],username = req.body["username"];
	var md5 = crypto.createHash("md5");
	var password = md5.update(pass).digest("base64");
	if(!pass){
		req.session.error = "请输入密码";
		res.redirect("/login");
	}
	User.get(username,function(err,user){
		if(user && user.password == password){
			req.session.user = user;
			return res.redirect("/");
		} else {
			//res.locals.error = err;
			req.session.error = "用户名或密码错误";
			return res.redirect("/login");
		}
	});
});

module.exports = router;