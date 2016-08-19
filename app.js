var express = require('express');
var http = require('http');
var handler = require('./routes/handler.js');
var DataAccess = require('./dataaccess.js');

var config = {
	server: "localhost",
	username: "chois",
	password: "borry",
	database: "ntx"
};
var da = new DataAccess(config);
var app = module.exports = express();
var server = http.createServer(app);

// configuration
app.set('respath', __dirname + '/public');
app.use(express.static(__dirname + '/public'));

app.use('/echo', handler.echo);
app.use('/inflate/:url', handler.inflate(da));
app.use('/deflate/:url', handler.deflate(da)); 

var listener = server.listen(3000, function(){
  console.log("Express: listening on port %d in %s mode", listener.address().port, app.settings.env);
});
