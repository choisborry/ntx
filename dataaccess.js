var mysql = require("mysql");
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
DataAccess.prototype.invoke = function(sql, cb) {
	this.pool.getConnection(function(err, conn){
		if (err) {
			console.log(err);
			return;
		}
		conn.query(sql, function(err, rows) {
			if (err)
				cb(err, null);
			else
				cb(err, rows);
			conn.release();
		})
	})
}