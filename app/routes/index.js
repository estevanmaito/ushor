'use strict';

var ShortenerHandler = require(process.cwd() + '/app/controllers/shortenerHandler.server.js');

module.exports = function(app, db) {

	var shortenerHandler = new ShortenerHandler(db);

	app.route('/')
		.get(function(req, res) {
			res.sendFile(process.cwd() + '/public/index.html');
		});

	app.route('/:url')
		.get(shortenerHandler.getUrls)
		.post(shortenerHandler.addUrl);
};