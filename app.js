var express = require('express');
var http = require('http');
var handler = require('./routes/handler.js');
var DataAccess = require('./dataaccess.js');
var fs = require('fs');

var config;
try {
	config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
}
catch (e) {
	config = {
		mysql: {
			server: "localhost",
			username: "chois",
			password: "borry",
			database: "ntx"
		},
		http: {
			server: "localhost",
			port: 2999
		}
	};
}
var da = new DataAccess(config.mysql);
var app = module.exports = express();
var server = http.createServer(app);

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
};

// configuration
app.set('respath', __dirname + '/public');
app.use(express.static(__dirname + '/public'));
app.use(allowCrossDomain);

app.use('/echo', handler.echo);
app.use('/inflate/:url', handler.inflate(da));
app.use('/deflate/:url', handler.deflate(da)); 

var listener = server.listen(config.http.port, function(){
  console.log("Express: listening on port %d in %s mode", listener.address().port, app.settings.env);
});
