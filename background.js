// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function checkForValidUrl(tabId, changeInfo, tab) {
  // If the letter 'linkedin' is found in the tab's URL...
  if (tab.url.indexOf('linkedin') > -1) {
    // ... show the page action.
    chrome.pageAction.show(tabId);
  }
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

var callbacks = [];

function getPageInfo(callback) 
{ 
    // Add the callback to the queue
    callbacks.push(callback); 

    // Inject the content script into the current page 
    chrome.tabs.executeScript(null, { file: "contentscript.js" }); 
}; 

chrome.extension.onRequest.addListener(function(request) 
{
	var callback = callbacks.shift();
	callback(request); 
});
