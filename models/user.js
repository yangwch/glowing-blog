var mongodb = require("./db");

function User(user){
	this.name = user.name;
	this.password = user.password;
	this.icon = user.icon || "/upload/Penguins-croped.jpg";
};

module.exports = User;

User.prototype.save = function save(callback){
	var user = {
		name: this.name,
		password: this.password,
		icon: this.icon
	};

	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		// 读取 users 集合
		db.collection('users', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			// 为 name 属性添加索引
			collection.ensureIndex('name', {unique: true});
			// 写入 user 文档
			collection.insert(user, {safe: true}, function(err, user) {
				mongodb.close();
				callback(err, user);
			});
		});
	});
};
User.get = function get(username, callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		// 读取 users 集合
		db.collection('users', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			// 查找 name 属性为 username 的文档
			collection.findOne({name: username}, function(err, doc) {
				mongodb.close();
				if (doc) {
					// 封装文档为 User 对象
					var user = new User(doc);
					callback(err, user);
				} else {
					callback(err, null);
				}
			});
		});
	});
}
/*
	更新图标
*/
User.updateIcon = function(username, icon, callback){
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		// 读取 users 集合
		db.collection('users', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			collection.updateOne({name:username},{$set:{icon:icon}},function(err,result){
				mongodb.close();
				return callback(err,result);
			})
		});
	});
};


//获取用户列表
User.getList = function get(callback){
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}

		var collection = db.collection("users");
		collection.find({}).toArray(function(err,docs){
			db.close();
			callback(err,docs);
		});
	});
}

User.checkNotLogin = function (req, res, next) {
  if (!req.session.user) {
    req.session.error = '未登入';
    return res.redirect('/login');
  }
  next();
}