var Handler = {};

Handler.echo = function(req, res) {
	console.log("echo");
	res.status(500).send("connection error");
}

Handler.inflate = function(da) {
	return function(req, res) {
	    var url = req.params.url;
	    da.inflate(url, function(err, rows) {
	    	console.log("inflate: "+url);
	    	res.send("inflate");
	    });
	};
}

Handler.deflate = function(da) {
	return function(req, res) {
	    var url = req.params.url;
	    da.deflate(url, function(err, rows) {
	    	console.log("deflate: "+url);
	    	res.send("deflate");
	    });
	};
}

module.exports = Handler;