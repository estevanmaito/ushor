'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongo = require('mongodb').MongoClient;

var URImongo = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || process.env.MONGO_URI;

var app = express();

mongo.connect(URImongo, function(err, db) {
	if (err) {
		throw new Error('Database failed to connect!');
	} else {
		console.log('MongoDB succesfully connected on port 27017.');
	}

	app.use('/public', express.static(process.cwd() + '/public'));
	app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

	routes(app, db);

	// app.listen(3000, function() {
	// 	console.log('Listening on port 3000...');
	// });

	app.listen(process.env.PORT || 8080);

});