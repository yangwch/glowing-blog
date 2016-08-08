var express = require('express');
var router = express.Router();
var User = require("../models/user");
var Post = require("../models/post");
var uuid = require("node-uuid");
var gm = require("gm");

/* 用户设置 */
router.get('/settings', function(req, res, next) {
  res.render("settings",{title:"用户设置"});
});

/*修剪图片*/
router.post('/settings/crop',function(req,res){
	var user = req.session.user;
	if(!user){
		res.redirect("/login");
	}
	var fbody = req.body,srcImg = __dirname + '/../public'+fbody.dataImg,dstFilename=uuid.v1(),dstImg = __dirname + '/../public/upload/'+dstFilename+'.jpg';
	var width = fbody.dataWidth,height=fbody.dataHeight,x=fbody.dataX,y=fbody.dataY;
	gm(srcImg).crop(width, height, x, y).resize(30, 30, '!').write(dstImg, function (err) {
		if(err){
			console.log(err);
		}
		res.redirect("/");
	});
	var url = '/upload/'+dstFilename+'.jpg';
    req.session.success = "头像更改成功，重新登录体验新头像";
    User.updateIcon(user.name,url,function(err,result){
    	req.session.user = user;
    	res.redirect("/u/settings");
    });
    //res.send(info);
});

/**
	获取用户文章列表
**/
router.get("/", function(req,res){
	var user = req.session.user;
	if(user == null){res.redirect("/");}
	User.get(user.name, function(err, user) {
		if (!user) {
			req.session.error = '用户不存在';
			return res.redirect('/');
		}

		Post.get(user.name, function(err, posts) {
			if (err) {
				req.session.error = err;
				return res.redirect('/');
			}
			res.render('user', {
				title: user.name,
				posts: posts,
			});
		});
	});
});

/**
	获取blog列表
**/
router.post("/blogs", function(req,res){
	var user = req.session.user;
	if(user == null){res.redirect("/");}
	User.get(user.name, function(err, user) {
		if (!user) {
			req.session.error = '用户不存在';
			return res.redirect('/');
		}

		Post.get(user.name, function(err, posts) {
			if (err) {
				req.session.error = err;
				return res.redirect('/');
			}
			res.send(JSON.stringify(posts));
		});
	});
});

router.get('/list',function(req,res){
	User.getList(function(err,list){
		if(err){
			res.send(err);
		}
		res.send(list);
	});
});

/*删除*/
router.get("/d/:blogid", function(req,res){
	var user = req.session.user,blogid = req.params.blogid;
	if(user && blogid){
		Post.delete(blogid,user.name,function(err,result){
			if(err){
				req.session.error = err;
				return res.redirect("/u/"+user.name);
			}else{
				req.session.success = "删除成功！";
				res.redirect("/u/"+user.name);
			}
		});
	}else{
		res.redirect("/");
	}
});
var fs = require("fs");
var formidable = require("formidable");

var uplaodFile = function(req,res,next,callback){
	 var form = new formidable.IncomingForm();

    form.keepExtensions = true;

    form.uploadDir = __dirname + '/../public/upload';

    form.parse(req, function (err, fields, files) {

        if (err) {

            throw err;

        }

        var image = files.imgFile;

        var path = image.path;

        path = path.replace('/\\/g', '/');

        var url = '/upload' + path.substr(path.lastIndexOf('\\'), path.length);
        console.log("upload:"+path);
        var info = {

            "error": 0,

            "url": url

        };
        if(callback){
        	callback(info);
        }else{
        	res.send(info);
    	}
    });
};

/*上传文件*/
router.post("/upload_json", function(req,res,next){
	uplaodFile(req,res,next);
});


module.exports = router;
