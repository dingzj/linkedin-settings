/*
 * Copyright (c) 2010 The Chromium Authors. All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */
console.log("content script first line now " + new Date());

function setLocalStorage(key, value) {
	chrome.extension.sendRequest({method: "setLocalStorage", key: key, value: value}, function(response) { });
};

function setLocalAndSettings(defaultFlag) {
	$("#injectid").html("<div class='alert warning'>We are fixing your settings now, please wait...</div>");
	csrfToken = document.getElementById("nav-utility-auth").childNodes[0].href.split(/[=&]/)[3];
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
			$("#injectid").html("<div class='alert success'><p><strong>Well done.</strong>Your privacy settings are Good. </p></div>");
		} else {
			setLocalStorage('lastRecommendFlag', false);
			$("#injectid").html("<div class='alert warning'><p>You privacy settings may have problems. <a id='fixithref' href='#'> Fix it. </a> </p> </div>");
		}
	});
};

function responseFunction(response) {
	console.log("content script response: " + response.data);
	var isFirstRun = (response.data[0] == undefined);
	var lastSetTime = response.data[1];
	var lastRecommendFlag = response.data[2];
	
	if (isFirstRun == true) {
		// Open the options page if this is the first run
		setLocalStorage('isFirstRun', 'notFirstRun');
		console.log("--- contentscript First Time RUN: will send settings with recommended values");
		$("#injectid").html("<div class='alert warning'>We are checking your settings now, please wait...</div>");
		setTimeout(function () {
			if (pageInfo.csrfToken !== "") {
				console.log("--- contentscript  1 seconds over, sent settings with recommended values");
				setLocalAndSettings(true);
			}
		}, 1000);
	};
	if ( lastSetTime != null ) {
		if (lastRecommendFlag == 'true') {
			$("#injectid").html("<div class='alert success'><p><strong>Well done.</strong>Your privacy settings are Good.</p>  </div>");
		} else {
			$("#injectid").html("<div class='alert warning'><p>You privacy settings may have problems. <a id='fixithref' href='#'> Fix it. </a> </p> </div>");
			$('#fixithref').click(function (e) {setLocalAndSettings(true);});
		}
	};
};

function userChangedSettingOnWeb(){
	$(this).unbind('DOMSubtreeModified');
	setTimeout(function(){
		if ($('#global-error p strong').text().indexOf("have successfully") > 1 ) {
			console.log(" User changed settings on Web, your own risk : " + $('#global-error p strong'));
			$("#injectid").html("<div class='alert warning'><p>You changed settings at own risk!</p></div>");
			setLocalStorage('lastRecommendFlag', false);
			lastSetTime = new Date().toString().replace(/ GMT.*$/, "");
			setLocalStorage('lastSetTime', lastSetTime);
			chrome.extension.sendRequest({method: "getLocalStorage", key: keys}, responseFunction);
		}
		$('#global-error').bind('DOMSubtreeModified',userChangedSettingOnWeb);
	}, 1000);
};

function contentListener(request, sender, sendResponse) {
	if (request.data == "getPageInfo")
		sendResponse({data: pageInfo});
	else if (request.data == "updatePageMsg") {
		chrome.extension.sendRequest({method: "getLocalStorage", key: keys}, responseFunction);
	}
}

//after document-load
$('#global-error').bind('DOMSubtreeModified', userChangedSettingOnWeb);
$(".top-nav .wrapper").append("<div id='injectid'>  </div>");

var pageInfo = {
    "title": document.title,
    "url": window.location.href,
		"csrfToken": document.getElementById("nav-utility-auth").childNodes[0].href.split(/[=&]/)[3]
};
var keys = ["isFirstRun", "lastSetTime", "lastRecommendFlag"];

chrome.runtime.onMessage.addListener(contentListener);
chrome.extension.sendRequest({method: "getLocalStorage", key: keys}, responseFunction);
