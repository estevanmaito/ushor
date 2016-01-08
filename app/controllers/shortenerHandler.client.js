'use strict';

(function () {
	var sendButton = document.querySelector('.btn-send');
	var urlInput = document.querySelector('.long-url');
	var resultingUrl = document.querySelector('.resulting-url');
	var apiUrl = process.env.APP_URL;

	function ajaxRequest (method, url, callback) {
		var http = new XMLHttpRequest();

		http.onreadystatechange = function() {
			if (http.readyState === 4 && http.status === 200) {
				callback(http.response);
			}
		};

		http.open(method, url, true);
		http.send();
	}

	function isValidUrl (url) {
		return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url);
	}

	function updateResultingUrl (data) {
		resultingUrl.innerHTML = data;
	}

	sendButton.addEventListener('click', function() {
		var cleanUrl = isValidUrl(urlInput.value) ? urlInput.value : 
						(isValidUrl('http://' + urlInput.value) ? 'http://' + urlInput.value : false);
		if (cleanUrl) ajaxRequest('POST', apiUrl + encodeURIComponent(cleanUrl), updateResultingUrl);
		else updateResultingUrl('Please, use a valid URL.');

	}, false);

})(); 