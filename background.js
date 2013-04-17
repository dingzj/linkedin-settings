// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function getPageInfo(callback) { 
		chrome.tabs.getSelected(null, function(tab) {
		  chrome.tabs.sendMessage(tab.id, {data: "getPageInfo"}, function(response) {
		    callback(response.data);
		  });
		});
};
function updatePageMsg() { 
		chrome.tabs.getSelected(null, function(tab) {
		  chrome.tabs.sendMessage(tab.id, {data: "updatePageMsg"}, function(response) { });
		});
};
function checkForValidUrl(tabId, changeInfo, tab) {
	if (tab.url.indexOf('linkedin.com') > -1) {
		chrome.pageAction.show(tabId);
	}
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if (request.method == "getLocalStorage") {
		var arr = request.key;
		for (var i=0; i<arr.length; i++) {
			arr[i] = localStorage[arr[i]];
		}
		sendResponse({data: arr});
		console.log("background call listener : " + request.key + " : : " + localStorage[request.key]);
	} else if (request.method == "setLocalStorage"){
		localStorage[request.key] = request.value;
	} else {
		sendResponse({}); // snub them.
	}
});
