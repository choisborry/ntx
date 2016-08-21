var mysql = require("mysql");
var base64 = require("base-64");
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
DataAccess.prototype.inflate = function(shortUrl, cb) {
	var hashIndex = urlhash.shorturl2index(shortUrl);
	var sql = "SELECT URL From Mappings WHERE `Index`="+hashIndex;
	//console.log(sql);
	
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
				var longUrl;
				if (result.length > 0) {
					longUrl = base64.decode(result[0].URL);
				}
				else {
					longUrl = "";
				}
				cb(err, longUrl);
			}
			conn.release();
		})
	})
}

DataAccess.prototype.deflate = function(longUrl, cb) {
	var encUrl = base64.encode(longUrl);
	var lookup = "SELECT `Index` FROM Mappings Where URL='"+encUrl+"'";
    var sql = "INSERT INTO Mappings SET ?";
    var params = {URL: encUrl};

	this.pool.getConnection(function(err, conn){
		if (err) {
			console.log(err);
			return;
		}
		conn.query(lookup, function(err, result) {
			if (err) {
				console.log(err);
				cb(err, null);
			}
			else {
				if (result.length == 0) {
					conn.query(sql, params, function(err, result) {
						if (err) {
							console.log(err);
							cb(err, null);
						}
						else {
							var index = result.insertId;
							console.log("new entry: "+result.insertId);
							var shortUrl = urlhash.index2shorturl(index);
							cb(err, shortUrl);
						}
					})
				}
				else {
					var index = result[0].Index;
					console.log("lookup entry: "+index);
					var shortUrl = urlhash.index2shorturl(index);
					cb(err, shortUrl);
				}
			}
			conn.release();
		})
	})
}
