var mongodb = require("./db");
var uuid = require("node-uuid");
function Post(username,post,time,content,tags,category,commentFlag,publicity){
	this.user = username;
	this.post = post;
	this.content = content;
	this.tags = tags;//标签
	this.category = category;//分类 
	this.commentFlag = commentFlag;//评论选项 1：所有人可评论，2：不允许匿名3：不允许评论
	this.publicity = publicity;
	if(time){
		this.time = time;
	}else{
		this.time = new Date();
	}
}

module.exports = Post;

Post.prototype.save = function(callback){
	console.log('save...')
	var posti = {
		uuid:uuid.v1(),
		user:this.user,
		post:this.post,
		time:this.time,
		content:this.content,
		tags: this.tags,
		category: this.category,
		commentFlag: this.commentFlag,
		publicity: this.publicity
	};
	mongodb.open(function(err,db){
		console.log('opened....');
		if(err){
			console.log(err);
			return callback(err);
		}
		db.collection("posts", function(err,collection){
			console.log('opened posts....');
			if(err){
				console.log(err);
				mongodb.close();
				return callback(err);
			}
			console.log('ensureingIndex...');
			//创建索引 - user属性
			collection.ensureIndex("user");
			console.log('insert....')
			collection.insert(posti,{safe:true},function(err,doc){
				mongodb.close();
				return callback(err,doc);
			});
		});
	});
}
Post.prototype.updateBlog = function(uuid,callback){

	var posti = {
		user:this.user,
		post:this.post,
		time:this.time,
		content:this.content
	};
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection("posts", function(err,collection){
			if(err){
				mongodb.close();
			}
			var query = {uuid:uuid};
			collection.updateOne(query,{$set:posti}, null,function(err,result){
				mongodb.close();
				callback(err,result);
			});
		});
	});
}

Post.get = function(user,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection("posts",function(err,collection){
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

Post.getBlog = function(blogid,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection("posts", function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {uuid:blogid};
			collection.findOne(query, function(err, doc) {
				mongodb.close();
				if (doc) {
					callback(err, doc);
				} else {
					callback(err, null);
				}
			});
		});
	})

}

Post.delete = function(blogid,username,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection("posts", function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {uuid:blogid,user:username};
			collection.remove(query,{safe:true},function(err,result){
				mongodb.close();
				callback(err,result);
			});
		})
	});
}
