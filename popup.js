//$.getScript("settings.js");


var isFirstRun = (localStorage['isFirstRun'] == undefined);
var lastSetTime = localStorage['lastSetTime'];
var lastRecommendFlag = localStorage['lastRecommendFlag'];
var returnDefaultFlag = false;


function setAllSettings(defaultFlag) {
	$("#div-customize-message").html("<div class='alert alert-success'>We are fixing your settings now, please wait...</div>");
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
			$("#div-customize-message").html("<div class='alert alert-success'><strong>Cheers!</strong> Your privacy settings were fixed now!</div>");
			$("#div-home-message").html("<div class='alert alert-success'><strong>Well Done.</strong> Your settings was fixed on " + lastSetTime + "</div>");	
			$("#div-home-fix-message")[0].style.visibility = "hidden";
		} else {
			localStorage['lastRecommendFlag'] = false;
			$("#div-customize-message").html("<div class='alert'> Your customized privacy settings were updated! </div>");
			$("#div-home-message").html("<div class='alert'> Your customized settings were set on " + lastSetTime + " </div>");
			$("#div-home-fix-message")[0].style.visibility = "visible";
		}
	});
}

/* Parse the csrfToken to popup window, such that xmlhttp request can get valid response
----------------------------------*/
function onPageInfo(o) { 
	document.getElementById("csrfToken").value = o.csrfToken; 
	csrfToken = o.csrfToken;
	console.log("--- onPageInfo csrfToken = " + csrfToken);
}

function deleteLocalStorage() {
	console.log("--- delete localStorage now....");
	localStorage.removeItem('isFirstRun');
	localStorage.removeItem('lastSetTime');
	localStorage.removeItem('lastRecommendFlag');
}

function mainFunction() {
	console.log("--- Starting main function call ");
	prepareAllObjects();
	
	console.log("--- Object prepared ready, get csrfToken now");
  var bg = chrome.extension.getBackgroundPage();
  bg.getPageInfo(onPageInfo);
	console.log("--- Binding the function to buttons now");
	
	$("#btn-get-all-settings").click(getAllSettings);
	
	$("#btn-recommend-all-settings").click(recommendSettings);
	$("#btn-recommend-all-settings")[0].style.visibility = "hidden";	
	
	$("#btn-set-all-settings").click(setAllSettings);
	$("#btn-set-all-settings")[0].style.visibility = "hidden";
	
	$("#btn-delete-local-storage").click(deleteLocalStorage);
	
	$("#btn-set-recommend-settings").click(function () {
		setAllSettings(true);
		setTimeout(function () { getAllSettings(); }, 800);
	});
	
	if (isFirstRun == true) {
		// Open the options page if this is the first run
		localStorage['isFirstRun'] = 'notFirstRun';
		console.log("--- First Time RUN: will send settings with recommended values");
		$("#div-home-message").html("<div class='alert alert-success'>Checking your Linkedin Settings now...</div>");
		setTimeout(function () {
			if (csrfToken !== "") {
				console.log("--- .5 seconds over, sent settings with recommended values");
				setAllSettings(true);
			}
		}, 500);
	};
	
	if ( lastSetTime != null ) {
		if (localStorage['lastRecommendFlag'] == 'true') {
			$("#div-home-message").html("<div class='alert alert-success'><strong>Well Done.</strong> Your settings was fixed on " + lastSetTime + "</div>");
			$("#div-home-fix-message")[0].style.visibility = "hidden";
		} else {
			$("#div-home-message").html("<div class='alert'> Your customized settings were set on " + lastSetTime + " </div>");
			$("#div-home-fix-message")[0].style.visibility = "visible";
		}
	}
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

// Tweet Javascript
function social(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (!d.getElementById(id)) {
		js = d.createElement(s);
		js.id = id;
		js.src = "https://platform.twitter.com/widgets.js";
		fjs.parentNode.insertBefore(js, fjs);
	}
};
social(document, "script", "twitter-wjs");