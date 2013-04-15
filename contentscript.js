/*
 * Copyright (c) 2010 The Chromium Authors. All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */

$(".top-nav .wrapper").append("<div class='account' id='injectid'>  </div>");

// Object to hold information about the current page

var pageInfo = {
    "title": document.title,
    "url": window.location.href,
		"csrfToken": document.getElementById("nav-utility-auth").childNodes[0].href.split(/[=&]/)[3]
};
// Send the information back to the extension
//chrome.extension.sendRequest(pageInfo);
var setLocalStorage = function (key, value) {
	chrome.extension.sendRequest({method: "setLocalStorage", key: key, value: value}, function(response) { });
};

var setLocalAndSettings = function (defaultFlag) {
	$("#injectid").html("<span class='alert alert-success'>We are fixing your settings now, please wait...</div>");
	var deferreds = [];
	returnDefaultFlag = true;
	for (i=0; i<loadRadioArr.length; i++) { 
		deferreds.push(setRadioSetting(loadRadioArr[i], defaultFlag));
	}
	for (i=0; i<loadOptionArr.length; i++) { 
		deferreds.push(setOptionSetting(loadOptionArr[i], defaultFlag));
	}
	lastSetTime = new Date().toString().replace(/ GMT.*$/, "");
	setLocalStorage('lastSetTime', lastSetTime);
	
	$.when(deferreds).done(function() {
		if (returnDefaultFlag == true) {
			setLocalStorage('lastRecommendFlag', true);
			$("#injectid").html("<span class='alert alert-success'><strong>Cheers!</strong> Your privacy settings were fixed now!</div>");
		} else {
			setLocalStorage('lastRecommendFlag', false);
			$("#injectid").html("<span class='alert'> Your customized privacy settings were updated! </div>");
		}
	});
}

chrome.extension.sendRequest({method: "getLocalStorage", key: ["isFirstRun", "lastSetTime", "lastRecommendFlag"]}, function(response) {
	console.log("content script response: " + response.data);
	var isFirstRun = (response.data[0] == undefined);
	var lastSetTime = response.data[1];
	var lastRecommendFlag = response.data[2];
	
	if (isFirstRun == true) {
		// Open the options page if this is the first run
		setLocalStorage('isFirstRun', 'notFirstRun');
		console.log("--- contentscript First Time RUN: will send settings with recommended values");
		$("#injectid").html("<span>Checking your Linkedin Settings now...</span>");
		setTimeout(function () {
			if (pageInfo.csrfToken !== "") {
				console.log("--- contentscript  .5 seconds over, sent settings with recommended values");
				setLocalAndSettings(true);
			}
		}, 5000);
	};
	if ( lastSetTime != null ) {
		if (lastRecommendFlag == 'true') {
			$("#injectid").html("<span class='alert alert-success'><strong>Well Done.</strong> Your settings was fixed on " + lastSetTime + "</span>");
		} else {
			$("#injectid").html("<span class='alert'> Your customized settings were set on " + lastSetTime + " </span>");
			$("#injectid").append("<br /><span class='alert'> Fix your settings with our recommendation <input type='button' id='btn-set-recommend-settings' name='set-all-setting' value='Fix It'> </span>");
		}
	};
});