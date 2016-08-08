var express = require('express');
var util = require("util");
var router = express.Router();
var Post = require("../models/post");
var images = require("images");

var fs = require("fs");

/* GET home page. */
router.get('/', function(req, res) {
	/*var dir = "D:\\Workspace\\javaEE_Kepler\\UMS\\src\\main\\webapp\\statics\\themes\\default\\devices\\topology";
	fs.readdir(dir,function(err,files){
		if(err){
			console.log(err);
		}else{
			var afiles = {};
			files.forEach(l => (function(l){
				afiles[l] = {width:images(dir+"\\"+l).width(),height:images(dir+"\\"+l).height()};
			})(l));
			console.log(afiles);
		}
	})


	var path = "C:\\node\\microblog\\public\\img\\icons\\1.png";
	var width = images(path).width(),height=images(path).height();
	console.log(width+":"+height);*/
	Post.get(null, function(err, posts) {
		if (err) {
			res.locals.error = err;
		}
	  	res.render('index', { title: '首页',posts:posts });
	});
});

router.get("/list",function(req,res){
  res.render("list",{
    title:"LIST",
    items:["ejs","node.js","express","supervisor"]
  });
});

/*发表*/
router.get("/say", function(req,res){
	res.render("say", {title:"发表",post:{}});
});

router.get("/say/:blogid", function(req,res){
	Post.getBlog(req.params.blogid,function(err,post){
		if(post){
			res.render("say",{title:post.post+" 修改",post:post});
		}else{
			console.log("redirect....")
			res.redirect("/");
		}
	});
});

//
router.get("/showb/:blogid", function(req,res){
	console.log("显示详细。。。");
	Post.getBlog(req.params.blogid,function(err,post){
		if(post){
			res.render("showBlog",{title:post.post,post:post});
		}else{
			console.log("redirect....")
			res.redirect("/");
		}
	});
});

module.exports = router;
