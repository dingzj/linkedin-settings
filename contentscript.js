/*
 * Copyright (c) 2013 Barracuda Labs. All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */
if (isDevelopment) {
	console.log("content script first line now " + new Date());
}

function setLocalStorage(key, value) {
	chrome.extension.sendRequest({method: "setLocalStorage", key: key, value: value}, function(response) { });
};

function setLocalAndSettings(defaultFlag) {
	$("#injectid").html( LIHomeUpdating );
	csrfToken = $("a:contains(Sign Out)")[0].href.split(/[=&]/)[3];
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
			$("#injectid").html( LIHomeSuccess );
		} else {
			setLocalStorage('lastRecommendFlag', false);
			$("#injectid").html( LIHomeBad );
		}
	});
};

function responseFunction(response) {
	if (isDevelopment) {
		console.log("content script response: " + response.data);
	}
	var isFirstRun = (response.data[0] == undefined);
	var lastSetTime = response.data[1];
	var lastRecommendFlag = response.data[2];
	
	if (isFirstRun == true) {
		// Open the options page if this is the first run
		setLocalStorage('isFirstRun', 'notFirstRun');
		if (isDevelopment) {
			console.log("--- contentscript First Time RUN: will send settings with recommended values");
		}
		$("#injectid").html( LIHomeFirstCheck );
		setTimeout(function () {
			if (pageInfo.csrfToken !== "") {
				if (isDevelopment) {
					console.log("--- contentscript  1 seconds over, sent settings with recommended values");
				}
				setLocalAndSettings(true);
			}
		}, 1000);
	};
	if ( lastSetTime != null ) {
		if (lastRecommendFlag == 'true') {
			$("#injectid").html( LIHomeSuccess );
		} else {
			$("#injectid").html( LIHomeBad );
			$('#fixithref').click(function (e) {setLocalAndSettings(true);});
		}
	};
};

function userChangedSettingOnWebFunc() {
	txt = $('#global-error p strong').text();
	if (txt.indexOf("have successfully") > 1 || txt.indexOf("settings have been changed") > 1) {
		if (isDevelopment) {
			console.log(" User changed settings on Web, your own risk : " + $('#global-error p strong'));
		}
		$("#injectid").html( LIHomeAtRisk );
		setLocalStorage('lastRecommendFlag', false);
		lastSetTime = new Date().toString().replace(/ GMT.*$/, "");
		setLocalStorage('lastSetTime', lastSetTime);
		chrome.extension.sendRequest({method: "getLocalStorage", key: keys}, responseFunction);
	}
}

function userChangedSettingOnWeb(){
	$(this).unbind('DOMSubtreeModified');
	setTimeout(function(){
		userChangedSettingOnWebFunc();
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
userChangedSettingOnWebFunc();

$("#global-search").css("margin-left", "5px");
$("#global-search").css("margin-right", "0px");
$("#search-box-container").css("width", "210px");
$("#main-search-box").css("width", "200px");
$("#top-header .wrapper").append("<div id='injectid' style='height: 20px !important;'>  </div>");
$("#top-header .advanced-search-outer").css("width", "25px");

var pageInfo = { "csrfToken": $("a:contains(Sign Out)")[0].href.split(/[=&]/)[3] };
var keys = ["isFirstRun", "lastSetTime", "lastRecommendFlag"];
if (chrome_ver >= 20 ) {
	chrome.runtime.onMessage.addListener(contentListener);
} else {
	chrome.extension.onRequest.addListener(contentListener);
}
chrome.extension.sendRequest({method: "getLocalStorage", key: keys}, responseFunction);
