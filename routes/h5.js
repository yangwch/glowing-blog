var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/drag', function(req, res, next) {
	res.render("drap",{title:"Drap & Drop",content:"当前时间为："+(new Date()).toString(),name:"Zhangsan",items:["Orange","Banana","Apple","Potato"]});
  //res.send();
});

router.get("/canvas", function(req,res,next){
	res.render("canvas",{title:"canvas"});
});

module.exports = router;