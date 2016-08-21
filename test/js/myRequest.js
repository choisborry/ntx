var agent = require('request');
var time = require('time');

var method = MyRequest.prototype;

function MyRequest(baseUrl, basePort) {
    this.baseUrl = baseUrl;
    this.basePort = basePort;    
    this.requestUrl = "http://"+this.baseUrl+":"+this.basePort.toString();
    this.header = {
        "Content-Type": "text/plain"
    };
}

method.deflate = function(longUrl, cb) {
    var endpoint = "/deflate/"+encodeURIComponent(longUrl);
    var options = {
        url: this.requestUrl+endpoint,
        headers: this.header,
        json: false
    };

    agent.get(options, function(err, response, body) {
        if (err) {
            cb(true, 500);
        }
        else {
        	if (response.statusCode == 200) {
        		//console.log(body);
        		cb(false, body);
        	}
        	else {
        		cb(true, response.statusCode)
        	}
        }
    });
}

method.inflate = function(shortUrl, cb) {
    var endpoint = "/inflate/"+encodeURIComponent(shortUrl);
    var options = {
        url: this.requestUrl+endpoint,
        headers: this.header,
        json: false
    };

    agent.get(options, function(err, response, body) {
        if (err) {
            cb(true, 500);
        }
        else {
        	if (response.statusCode == 200) {
        		//console.log(body);
        		cb(false, body);
        	}
        	else {
        		cb(true, response.statusCode)
        	}
        }
    });
}

module.exports = MyRequest;