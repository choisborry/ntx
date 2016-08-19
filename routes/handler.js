module.exports = Handler;

function Handler() {
}

Handler.prototype.inflate = function(da) {
	return function(req, res, next) {
	    var url = req.query.url;
	    da.invoke("select * from Mappings", function(err, rows) {
	    	console.log("inflate");
	    	res.send("inflate");
	    });
	};
}

Handler.prototype.deflate = function(da) {
	return function(req, res, next) {
	    var url = req.query.url;
	    da.invoke("select * from Mappings", function(err, rows) {
	    	console.log("deflate");
	    	res.send("deflate");
	    });
	};
}