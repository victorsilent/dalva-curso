/**
 * Finds and downloads all embeded Vimeo videos.
 */
function downloadEmbededVideos() {
	
	// Find Vimeo embed frame
	var embedFrames = document.querySelectorAll('iframe[src*="player.vimeo.com"]');
	
	// No embed frames found?
	if (!embedFrames.length) {
		console.error("Failed to identify embeded video frame");
		return;
	}
	
	// Retrieve embed source
	for (var i = 0; i < embedFrames.length; i++) {
		console.log('Requesting source for embedded video: ', embedFrames[i]);
		getSource(embedFrames[i].src, function(response) {
			var mp4Url = findMp4Url(response);
			console.log('Downloading "' + mp4Url + '"...');
			downloadFile(mp4Url);
		});
	}
}

/**
 * Retrieves content source at given URL.
 * @param {string} url URL from which content source will be retrieved
 * @param {function} callback Called with the retrieved source on successful retrieval
 */
function getSource(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			callback(xhr.responseText);
		}
	};
	xhr.open("GET", url, true);
	xhr.send(null);
};

/**
 * Finds mp4 URL within Vimeo embed source.
 * @param {string} source Source to search for mp4 URL
 * @return {string} The mp4 URL
 */
function findMp4Url(source) {
	return source.match(/"url"\s*:\s*"(https?:\/\/[^"]+\.vimeocdn\.com\/[^"]+\.mp4(\?([^"]+=[^"]+;?)+)?)"/)[1];
}

/**
 * Downloads the file at a given URL.
 * @param {string} url The URL of the file to download
 */
function downloadFile(url) {
	var filename = url.substring(url.lastIndexOf("/") + 1).split("?")[0];
	var xhr = new XMLHttpRequest();
	xhr.responseType = 'blob';
	xhr.onload = function() {
		var a = document.createElement('a');
		a.href = window.URL.createObjectURL(xhr.response);
		a.download = filename;
		a.style.display = 'none';
		document.body.appendChild(a);
		a.click();
		delete a;
	};
	xhr.open('GET', url);
	xhr.send();
}

module.exports = downloadEmbededVideos;
