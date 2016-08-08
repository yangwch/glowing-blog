var settings = require("../settings");
var Db = require("mongodb").Db;
console.log("-----settings");
console.log(settings);

//var Connection = require("mongodb").Connection;
var Server = require("mongodb").Server;

module.exports = new Db(settings.db,new Server(settings.host, 27017,{}));