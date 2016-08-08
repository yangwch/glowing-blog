var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var user = req.session.user;
	if(user){
		req.session.user = null;
	}
	req.session.success = "已登出";
	res.redirect("/");
	//res.render("hello",{title:"已登出",content:"当前时间为："+(new Date()).toString(),name:"Zhangsan",items:["Orange","Banana","Apple","Potato"]});
  //res.send();
});

module.exports = router;