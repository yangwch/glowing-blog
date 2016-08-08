var express = require('express');
var router = express.Router();
var calendar = require("../models/calendar");

router.get('/', function(req, res, next) {
	var user =req.session.user;
	if(!user){
		req.session.error = "请登录";
		return res.redirect("/");
	}
	res.render("calendar",{title:"我的日程"});
});

/*获取日程列表*/
router.get("/list", function(req, res){
	var user =req.session.user;
	if(!user){
		req.session.error = "请登录";
		return res.redirect("/");
	}
	console.log(user.name);
	calendar.getList(user.name, function(err,docs){
		res.send(docs);
	});
});

/*保存*/
router.post("/save", function(req,res){
	var user =req.session.user;
	if(!user){
		req.session.error = "请登录";
		return res.redirect("/");
	}
	var event = req.body;
	//console.log(event);
	var newCalendar = new calendar(user.name,event.title,event.start,event.end,event.description,event.icon,event["className[]"]);

	if(event.uuid){
		newCalendar.update(event.uuid,function(err,doc){
			res.send(doc);
		});
	}else{
		newCalendar.save(function(err,doc){
			res.send(doc);
		});
	}
});

/*删除*/
router.get("/d/:uuid", function(req,res){
	var user =req.session.user;
	if(!user){
		req.session.error = "请登录";
		return res.redirect("/");
	}
	calendar.delete(req.params.uuid,user.name, function(err, result){
		res.send(result);
	});
});

module.exports = router;