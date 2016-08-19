var Handler = {};

Handler.echo = function(req, res) {
	console.log("echo");
	res.status(500).send("connection error");
}

Handler.inflate = function(da) {
	return function(req, res) {
	    var url = req.params.url;
	    console.log("handler.inflate: "+url);
	    da.inflate(url, function(err, result) {
	    	console.log("inflate: "+result);
	    	res.send("inflate: "+result);
	    });
	};
}

Handler.deflate = function(da) {
	return function(req, res) {
	    var url = req.params.url;
	    console.log("handler.deflate: "+url);
	    da.deflate(url, function(err, result) {
	    	console.log("deflate: "+result);
	    	res.send("deflate: "+result);
	    });
	};
}

module.exports = Handler;