/*
 * Copyright (c) 2013 Barracuda Labs. All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */

function checkForValidUrl(tabId, changeInfo, tab) {
	var index = tab.url.indexOf('www.linkedin.com');
	if ( index > -1 && index < 13) {
		chrome.pageAction.show(tabId);
	}
};
function getPageInfo(callback) { 
		chrome.tabs.getSelected(null, function(tab) {
			if (chrome_ver >= 20) {
			  chrome.tabs.sendMessage(tab.id, {data: "getPageInfo"}, function(response) {
			    callback(response.data);
			  });
			} else {
			  chrome.tabs.sendRequest(tab.id, {data: "getPageInfo"}, function(response) {
			    callback(response.data);
			  });				
			}
		});
};
function updatePageMsg() { 
		chrome.tabs.getSelected(null, function(tab) {
			if (chrome_ver >= 20) {
		  	chrome.tabs.sendMessage(tab.id, {data: "updatePageMsg"}, function(response) { });
			} else {
				chrome.tabs.sendRequest(tab.id, {data: "updatePageMsg"}, function(response) { });
			}
			});
};
function bgReqListener(request, sender, sendResponse) {
	if (request.method == "getLocalStorage") {
		var arr = request.key;
		for (var i=0; i<arr.length; i++) { arr[i] = localStorage[arr[i]]; }
		sendResponse({data: arr});
		if (isDevelopment) {
			console.log("background call listener : " + request.key + " : : " + localStorage[request.key]);
		}
	} else if (request.method == "setLocalStorage"){
		localStorage[request.key] = request.value;
	} else {
		sendResponse({}); // snub them.
	}
}
// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
chrome.extension.onRequest.addListener(bgReqListener);