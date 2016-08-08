var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render("jsPlumb",{title:"HELLO",content:"当前时间为："+(new Date()).toString(),name:"Zhangsan",items:["Orange","Banana","Apple","Potato"]});
  //res.send();
});

router.get("/highcharttable", function(req,res){
	res.render("highcharttable",{title:"highcharttable"});
});

module.exports = router;