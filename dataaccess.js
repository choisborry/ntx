var mysql = require("mysql");
var urlhash = require("./urlhash.js");

module.exports = DataAccess;

function DataAccess(config) {
	this.pool  = mysql.createPool({
		host     : config.server,
		user     : config.username,
		password : config.password,
		database : config.database
	});
	if (this.pool == null)
		console.log("createPool failed");
}
DataAccess.prototype.inflate = function(url, cb) {
	var hashIndex = urlhash.url2index(url);
	var sql = "SELECT URL From Mappings WHERE Index="+hashIndex;
	
	this.pool.getConnection(function(err, conn) {
		if (err) {
			console.log(err);
			return;
		}
		conn.query(sql, function(err, result) {
			if (err) {
				cb(err, null);
			}
			else {
				cb(err, result);
			}
			conn.release();
		})
	})
}

DataAccess.prototype.deflate = function(url, cb) {
    var sql = "INSERT INTO Mappings SET ?";
    var params = {URL: url};

	this.pool.getConnection(function(err, conn){
		if (err) {
			console.log(err);
			return;
		}
		conn.query(sql, params, function(err, result) {
			if (err)
				cb(err, null);
			else {
				var index = result.insertId;
				console.log(result.insertId);
				var shortUrl = urlhash.index2url(index);
				cb(err, shortUrl);
			}
			conn.release();
		})
	})
}
