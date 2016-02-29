'use strict';

//BASE SETUP
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var app = express();
var PORT = 3000;

var users = require('./controllers/users');
var recipes = require('./controllers/recipes');

//Setup Mongo Connection
if (process.env.NODE_ENV === 'dev' && !mongoose.connection.db) {
	mongoose.connect('mongodb://localhost:27017/test_cookbook_app');
} else if (!mongoose.connection.db) {
	mongoose.connect('mongodb://localhost:27017/cookbook_app');
}

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

//MIDDLEWARE
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//API ROUTES
app.use('/api/users', users);
app.use('/api/recipes', recipes);


//BASE ROUTES
app.get('/', function(req, res) {
	res.render('index');
});

var server = app.listen(PORT);
module.exports = server;
