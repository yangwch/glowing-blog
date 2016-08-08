var mongodb = require("./db");
var uuid = require("node-uuid");
function calendar(username,title,start,end,description,icon,className){
	this.username = username;
	this.title = title;
	this.start = start;
	this.end = end;
	this.icon = icon;
	this.description = description;
	this.className = className;
	
	this.time = new Date();
}

module.exports = calendar;

/*添加保存*/
calendar.prototype.save = function(callback){
	console.log('saveing calendar...')
	var posti = {
		uuid:uuid.v1(),
		title: this.title,
		user:this.username,
		start:this.start,
		end: this.end,
		icon: this.icon,
		description: this.description,
		className: this.className
	};
	mongodb.open(function(err,db){
		console.log('opened....');
		if(err){
			console.log(err);
			return callback(err);
		}
		db.collection("calendar", function(err,collection){
			console.log('opened calendar....');
			if(err){
				console.log(err);
				mongodb.close();
				return callback(err);
			}
			console.log('ensureingIndex...');
			console.log('insert....')
			collection.insert(posti,{safe:true},function(err,doc){
				mongodb.close();
				return callback(err,posti);
			});
		});
	});
}
/*更新*/
calendar.prototype.update = function(uuid,callback){

	var posti = {
		title:this.title,
		start:this.start,
		end: this.end,
		icon: this.icon,
		description: this.description,
		className: this.className
	};
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection("calendar", function(err,collection){
			if(err){
				mongodb.close();
			}
			var query = {uuid:uuid};
			collection.updateOne(query,{$set:posti}, null,function(err,result){
				if(!err){
					collection.findOne(query,function(err,doc){
						mongodb.close();
						callback(err,doc);
					});
				}else{
					callback(err);
				}
			});
		});
	});
}
/*获取列表*/
calendar.getList = function(user,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection("calendar",function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if(user){query.user = user};
			collection.find(query).sort({time: -1}).toArray(function(err, docs){
				return callback(err,docs);
			});
		})
	});
}

calendar.getOne = function(uuid,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection("calendar", function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {uuid:uuid};
			collection.findOne(query, function(err, doc) {
				mongodb.close();
				if (doc) {
					callback(err, doc);
				} else {
					callback(err, null);
				}
			});
		});
	});

}

calendar.delete = function(uuid,username,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection("calendar", function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {uuid:uuid,user:username};
			collection.remove(query,{safe:true},function(err,result){
				mongodb.close();
				callback(err,result);
			});
		})
	});
}
