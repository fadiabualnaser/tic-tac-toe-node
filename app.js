
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var cookie = require("cookie");
var connect = require("connect");
var cookieParser = require("cookie-parser");
var app = express();

// all environments


app.set('port', process.env.OPENSHIFT_NODEJS_PORT  || 3000);
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "192.168.0.106";
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.configure(function () {
    app.use(express.cookieParser());
    app.use(express.session({secret: 'secret', key: 'express.sid'}));
});


process.setMaxListeners(0);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);



var server = http.createServer(app);

server.listen(app.get('port') , ipaddress);


var io = require('socket.io')(server);
var socketHelpper = require("./game/socketHelpper.js").socketHelpper(io);
