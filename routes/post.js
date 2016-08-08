var express = require('express');
var router = express.Router();
var User = require("../models/user");
var Post = require("../models/post");
var fs = require("fs");
var formidable = require("formidable");

/* GET home page. */
router.get('/', function(req, res, next) {
	var user = req.session.user,posts=[];

	if(user){
		Post.get(user.name,function(err,collection){
			if(err){
				res.locals.error = err;
			}
			res.locals.posts = collection;
			res.render("/u",{title:"HELLO",content:"当前时间为："+(new Date()).toString(),name:"Zhangsan",items:["Orange","Banana","Apple","Potato"]});
		});
	}
	
  //res.send();
});

router.post("/",function(req,res,next){
	console.log(11);
	var user = req.session.user;
	var post = new Post(user.name, req.body.post,new Date(),req.body.content);
		
	post.save(function(err, doc){
		console.log(22);
		if(err){
		console.log(err);
			req.session.error = err;
			return res.redirect("/");
		}
		console.log(33);
		req.session.success = "发表成功！";
		return res.redirect("/u");
	});
});
//修改保存
router.post("/:blogid",function(req,res,next){
	var user = req.session.user;
	var post = new Post(user.name, req.body.post,new Date(),req.body.content);
	post.updateBlog(req.params.blogid,function(err,result){
		console.log("updated...")
		if(err){
			req.session.error = err;
			return res.redirect("/");
		}
		req.session.success = "更新成功！";
		return res.redirect("/u");
	});
});


module.exports = router;