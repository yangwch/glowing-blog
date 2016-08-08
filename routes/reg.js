var express = require('express');
var router = express.Router();

var User = require("../models/user");
var crypto = require("crypto");


/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.session.error){
		res.locals.error = req.session.error;
		req.session.error = null;
	}
	res.render("reg",{title:"注册"});
});

router.post("/", function(req,res){
	var form = req.body,pass = req.body["password"],passrepeat = req.body["passwordrepeat"],username = req.body["username"];
	if(!pass){
		req.session.error = "请输入密码";
		res.redirect("/reg");
	}
	if(pass && pass != passrepeat){
		req.session.error = "两次密码输入不一致";
		res.redirect('/reg');
	}
	var md5 = crypto.createHash("md5");
	var password = md5.update(pass).digest("base64");
	var newUser = new User({
		name: username,
		password:password
	});
	User.get(newUser.name,function(err,user){
		if(user){
			err = "用户已存在";
		}
		if(err){
			//res.locals.error = err;
			req.session.error = err;
			return res.redirect("/reg");
		}
		newUser.save(function(err){
			if(err){
				//res.locals.error = err;
				req.session.error = err;
				return redirect("/reg");
			}
			req.session.user = user;
			req.session.success = "注册成功";
			res.redirect("/");
		})
	})

});

module.exports = router;