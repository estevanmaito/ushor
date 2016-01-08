'use strict';

function shortenerHandler (db) {

	var urls = db.collection('urls');

	// the same method used in the client; check again to see if the url is still valid
	function isValidUrl (url) {
		return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url);
	}

	// generate a random, unique 5 digits strings with numbers and letters
	function makeid (collection) {
		var id = '';
		var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for (var i = 4; i >= 0; i--) {
			id += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		// try to find an id already in use, if finds, generate another
		collection.findOne({shortUrl: id}, function(err, result) {
			if (err) throw err;

			if (result) makeid(collection);
		});

		return id;
	}

	// method to return calls to a shortened url
	this.getUrls = function(req, res) {

		// search for the shortUrl present in the url
		urls.findOne({shortUrl: req.params.url}, {'_id': false}, function(err, result) {
			if (err) throw err;

			if (result) {
				// ok, found. redirect to the original link
				res.redirect(result.longUrl);
			} else {
				res.json('nothing found');
			}
		});

	};

	this.addUrl = function(req, res) {

		// the same validation made in the client side. just to be sure...
		var cleanUrl = isValidUrl(req.params.url) ? req.params.url : 
						(isValidUrl('http://' + req.params.url) ? 'http://' + req.params.url : false);
		
		// search if there is not a long url already saved
		urls.findOne({longUrl: cleanUrl}, {'_id': false}, function(err, result) {
			if (err) throw err;

			if (result) {
				// if already in the db, just return that entry
				res.send(process.env.APP_URL + result.shortUrl);
			} else {
				// else, insert a new one with a random url
				urls.insert({
					longUrl: cleanUrl,
					shortUrl: makeid(urls)
				}, function(err, result) {
					if (err) throw err;

					// return the new link
					res.send(process.env.APP_URL + result.ops[0].shortUrl);
				});
			}
		});
	};

}

module.exports = shortenerHandler;