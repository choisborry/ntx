const hashMap = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const shorturl_base = "http://ntx.co/";
const MAX_LONG_URL = 512;
const MAX_SHORT_URL = 8;	// > 200Trillion

var Handler = {};

Handler.echo = function(req, res) {
	//console.log("echo");
	res.send("echo");
}

Handler.inflate = function(da) {
	return function(req, res) {
	    var url = req.params.url;
	    if (url.startsWith(shorturl_base) == false) {
	    	console.log("Handler.inflate: invalid prefix: "+url);
	    	res.status(400).send("");
	    	return;
	    }
	    
	    var content_url = url.substring(shorturl_base.length);
	    if (content_url.length == 0 || content_url.length > MAX_SHORT_URL) {
	    	console.log("Handler.inflate: url is too long: "+content_url);
	    	res.status(400).send("");
	    	return;
	    }
	    if (content_url.match(/^[a-zA-Z0-9]+$/) == null) {
	    	console.log("Handler.inflate: invalid string: "+content_url);
	    	res.status(400).send("");
	    	return;
	    }
	    //console.log("handler.inflate: "+url);
	    da.inflate(content_url, function(err, result) {
	    	if (err)
	    		res.status(500).send("");
	    	else {
		    	//console.log("inflate: "+result);
	    		if (result=="")
	    			res.status(404).send("");
	    		else
	    			res.send(result);
	    	}
	    });
	};
}

Handler.deflate = function(da) {
	return function(req, res) {
	    var url = req.params.url;
	    //console.log("handler.deflate: "+url);
	    if (url.length == 0 || url.length > MAX_LONG_URL) {
	    	console.log("Handler.deflate: url is too long: size="+url.length);
	    	res.status(400).send("");
	    	return;
	    }
	    da.deflate(url, function(err, result) {
	    	if (err)
	    		res.status(500).send("");
	    	else {
		    	//console.log("deflate: "+result);
		    	res.send(shorturl_base+result);
	    	}
	    });
	};
}

module.exports = Handler;