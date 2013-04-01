function fetch_feed(url, callback) {         
	var xhr = new XMLHttpRequest();     
	xhr.onreadystatechange = function(data) {       
		if (xhr.readyState == 4) {         
			if (xhr.status == 200) {           
				var data = xhr.responseText;           
				callback(data);         
			} else {           
				callback(null);         
			}       
		}     
	}     
	// Note that any URL fetched here must be matched by a permission in     
	// the manifest.json file!     
	xhr.open('GET', url, true);     
	xhr.send(); 
} 
function onRequest(request, sender, callback) {         
	if (request.action == 'fetch_feed') {          
		fetch_feed(request.url, callback);        
	} 
}  
// Wire up the listener. 
chrome.extension.onRequest.addListener(onRequest); 

$(document).ready(function() {         
	fetch_feed(); 
}); 

function fetch_feed() {         
	chrome.extension.sendRequest({'action' : 'fetch_feed', 'url' : 'http://lifehacker.com/index.xml'},
		function(response) {
			display_stories(response);                 
		}         
	); 
}
