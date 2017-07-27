var express = require('express');
var compression = require('compression');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');

var api             =require('./routes/OAOAdminDB');
var admin_auth_api = require('./routes/admin_auth_api');
var admin_login = require('./routes/admin_login');
var appRoutes = require('./routes/app');
var push_to_server = require('./routes/pushToServerHelper');

var app = express();
//mongodb://sysdba:sysdba@ds131139.mlab.com:31139/mlabdb
// mongoose.connect("mongodb://mongodb://localhost:27017/oaoAdminDB", function(err, db){
    //mongodb://<dbuser>:<dbpassword>@ds123722.mlab.com:23722/empoweraus
    //mongodb://<dbuser>:<dbpassword>@ds123722.mlab.com:23722/empoweraus
    //mongodb://latitudefintechaustralia:latitude123@ds123722.mlab.com:23722/empoweraus
    mongoose.connect("mongodb://sysdba:sysdba@ds131139.mlab.com:31139/mlabdb", function(err, db){
    if(!err) {
        console.log("Connected to Database")
    }
    else{
        console.log(err);
        console.log("failed to connect");
    }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
  next();
});

app.use('/push_to_server', push_to_server);
app.use('/api',api);
app.use('/admin_auth_api',admin_auth_api);
app.use('/admin_login',admin_login);
app.use('/', appRoutes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.render('index');
});

module.exports = app;
