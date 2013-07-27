/*
 * Copyright (c) 2013 Barracuda Labs. All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */

var isFirstRun = (localStorage['isFirstRun'] == undefined);
var lastSetTime = localStorage['lastSetTime'];
var lastRecommendFlag = localStorage['lastRecommendFlag'];

function setAllSettings(defaultFlag) {
	$("#div-customize-message").html( MsgCustomFirstCheck );
	var deferreds = [];
	returnDefaultFlag = true;
	for (i=0; i<loadRadioArr.length; i++) { 
		deferreds.push(setRadioSetting(loadRadioArr[i], defaultFlag));
	}
	for (i=0; i<loadOptionArr.length; i++) { 
		deferreds.push(setOptionSetting(loadOptionArr[i], defaultFlag));
	}
	lastSetTime = new Date().toString().replace(/ GMT.*$/, "");
	localStorage['lastSetTime'] = lastSetTime;
	
	$.when(deferreds).done(function() {
		if (returnDefaultFlag == true) {
			localStorage['lastRecommendFlag'] = true;
			$("#div-customize-message").html( MsgCustomSuccess );
			$("#div-home-message").html(MsgHomeSuccess);	
			$("#div-home-fix-message").html("");
		} else {
			localStorage['lastRecommendFlag'] = false;
			$("#div-customize-message").html( MsgCustomUpdate );
			$("#div-home-message").html( MsgHomeCustom );
			$("#div-home-fix-message").html( MsgHomeFix );
			$("#btn-set-recommend-settings").click(function () {
				setAllSettings(true);
				setTimeout(function () { getAllSettings(); }, 800);
			});
			
		};
		var bg = chrome.extension.getBackgroundPage();
	  bg.updatePageMsg();
	});
}

function deleteLocalStorage() {
	if (isDevelopment) {
		console.log("--- delete localStorage now....");
	}
	localStorage.removeItem('isFirstRun');
	localStorage.removeItem('lastSetTime');
	localStorage.removeItem('lastRecommendFlag');
}

/* Parse the csrfToken to popup window, such that xmlhttp request can get valid response
----------------------------------*/
function onPageInfo(o) { 
	document.getElementById("csrfToken").value = o.csrfToken; 
	csrfToken = o.csrfToken;
	if (isDevelopment) {
		console.log("--- onPageInfo csrfToken = " + csrfToken);
	}
}

function mainFunction() {
	if (isDevelopment) {
		console.log("--- Starting main function call ");
		console.log("--- Object prepared ready, get csrfToken now");
	}
  var bg = chrome.extension.getBackgroundPage();
  bg.getPageInfo(onPageInfo);
	if (isDevelopment) {
		console.log("--- Binding the function to buttons now");
	}
	$("#btn-get-all-settings").click(getAllSettings);
	
	$("#btn-recommend-all-settings").click(recommendSettings);
	$("#btn-recommend-all-settings")[0].style.visibility = "hidden";	
	
	$("#btn-set-all-settings").click(setAllSettings);
	$("#btn-set-all-settings")[0].style.visibility = "hidden";
	
	$("#btn-delete-local-storage").click(deleteLocalStorage);
		
	if (isFirstRun == true) {
		// Open the options page if this is the first run
		localStorage['isFirstRun'] = 'notFirstRun';
		if (isDevelopment) {
			console.log("--- First Time RUN: will send settings with recommended values");
		}
		$("#div-home-message").html( MsgHomeFirstCheck );
		setTimeout(function () {
			if (csrfToken !== "") {
				if (isDevelopment) {
					console.log("--- .5 seconds over, sent settings with recommended values");
				}
				setAllSettings(true);
			}
		}, 500);
	};
	
	if ( lastSetTime != null ) {
		if (localStorage['lastRecommendFlag'] == 'true') {
			$("#div-home-message").html(MsgHomeSuccess);	
			$("#div-home-fix-message").html("");
		} else {
			$("#div-home-message").html( MsgHomeCustom );
			$("#div-home-fix-message").html( MsgHomeFix );
			$("#btn-set-recommend-settings").click(function () {
				setAllSettings(true);
				setTimeout(function () { getAllSettings(); }, 800);
			});
		}
	};
	// Auto-load customize Tab after click
	$('#customize-tab-href').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
		if ( $("#btn-recommend-all-settings")[0].getAttribute("style").match("hidden") != null ) {
			$("#btn-get-all-settings").click();
		}
		$("#div-customize-message").html("");
	});
}

window.onload = mainFunction;