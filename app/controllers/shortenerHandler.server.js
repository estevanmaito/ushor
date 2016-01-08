'use strict';

function shortenerHandler (db) {

	var urls = db.collection('urls');

	function isValidUrl (url) {
		return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url);
	}

	function makeid (collection) {
		var id = '';
		var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for (var i = 4; i >= 0; i--) {
			id += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		collection.findOne({shortUrl: id}, function(err, result) {
			if (err) throw err;

			if (result) makeid(collection);
		});

		return id;
	}

	this.getUrls = function(req, res) {

		urls.findOne({shortUrl: req.params.url}, {'_id': false}, function(err, result) {
			if (err) throw err;

			if (result) {
				res.redirect(result.longUrl);
			} else {
				res.json('found nothing');
			}
		});

	};

	this.addUrl = function(req, res) {

		var cleanUrl = isValidUrl(req.params.url) ? req.params.url : 
						(isValidUrl('http://' + req.params.url) ? 'http://' + req.params.url : false);
		
		urls.findOne({longUrl: cleanUrl}, {'_id': false}, function(err, result) {
			if (err) throw err;

			if (result) {
				res.send(process.env.APP_URL + '/' + result.shortUrl);
			} else {
				urls.insert({
					longUrl: cleanUrl,
					shortUrl: makeid(urls)
				}, function(err, result) {
					if (err) throw err;
					res.send(process.env.APP_URL + '/' + result.ops[0].shortUrl);
				});
			}
		});
	};

}

module.exports = shortenerHandler;