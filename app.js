var express = require('express');
var http = require('http');
var Handler = require('./routes/handler.js');
var DataAccess = require('./dataaccess.js');

var config = {
	server: "localhost",
	username: "chois",
	password: "borry",
	database: "ntx"
};
var da = new DataAccess(config);
var app = module.exports = express();
var handler = new Handler();
var server = http.createServer(app);

app.use('/inflate', handler.deflate(da));
app.use('/deflate', handler.inflate(da)); 

var listener = server.listen(3000, function(){
  console.log("Express: listening on port %d in %s mode", listener.address().port, app.settings.env);
});
