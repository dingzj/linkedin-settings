//$.getScript("settings.js");
var loadRadioArr = [ab, bm, la, ri, pim, pih];
var loadOptionArr = [av, cv, ppv];
var URL = "https://www.linkedin.com/settings/";		
var csrfToken = "";
var DOMAIN = 'barracudalabs.com';

var firstRun = (localStorage['firstRun'] == 'true');
var lastSetTime = localStorage['lastSetTime'];
var lastRecommendFlag = localStorage['lastRecommendFlag'];
var returnDefaultFlag = false;

/* Prepare objects such its values will be used later
----------------------------------*/

function prepareRadioObject(obj) {
	// get value part
	obj.setDivID = (obj.setName == null) ? "div-"+obj.name : "div-"+obj.setName;
	obj.setInputID = (obj.setName == null) ? "input-"+obj.name : "input-"+obj.setName;
	obj.getUrl = (obj.getPath == null) ? URL+obj.name : obj.getPath;
	// set value part
	obj.submitUrl = (obj.submitPath == null) ? URL+obj.name+"-submit" : obj.submitPath+"-submit";
	obj.setFindID = (obj.setName == null) ? "input-"+obj.name : "input-"+obj.setName;
	return obj;
}

function prepareOptionObject(obj) {
	// get value part
	obj.setDivID = (obj.setName == null) ? "div-"+obj.name : "div-"+obj.setName;
	obj.setInputID = (obj.setName == null) ? "select-"+obj.name : "input-"+obj.setName;
	obj.getUrl = (obj.getPath == null) ? URL+obj.name : obj.getPath;	
	// set value part
	obj.submitUrl = (obj.submitPath == null) ? URL+obj.name+"-submit" : obj.submitPath+"-submit";
	obj.setFindID = (obj.setName == null) ? "select-"+obj.name : "select-"+obobj.j.setName;
	return obj;
}

function prepareAllObjects() {
	for (i=0; i<loadRadioArr.length; i++) { prepareRadioObject(loadRadioArr[i]); }
	for (i=0; i<loadOptionArr.length; i++) { prepareOptionObject(loadOptionArr[i]); }
}

/* Load user's Linkedin Settings, and display it properly in popup window
----------------------------------*/

function getRadioSetting(obj) {		
	$("#" + obj.setDivID).html("");
	
	var params = "csrfToken="+csrfToken;
	var request = $.ajax({
		url: obj.getUrl,
		type: "GET",
		dataType: "HTML",
		data: params
	});
	
	return request.success(function (response, textStatus, jqXHR){
		var xmlDoc = $(response);
		console.log("This GET ajax responsed - " + obj.name);
		var msgElem  = xmlDoc.find("#" + obj.findID);
		var checked = "";
		obj.curValue = false;
		if (msgElem[0].checked === true) {
			obj.curValue = true;
			checked = "checked";
		}
		$("#" + obj.setDivID).html("<input type=\"checkbox\" id=\"" + obj.setInputID + "\" value=\"set\" " + checked + "> <label for=\"" + obj.setInputID + "\"> " + obj.setLabel + "</label> ");
	});
}

function getOptionSetting(obj) {	
	$("#" + obj.setDivID).html("");
	
	var params = "csrfToken="+csrfToken;
	var request = $.ajax({
		url: obj.getUrl,
		type: "GET",
		dataType: "HTML",
		data: params
	});
	
	return request.success(function (response, textStatus, jqXHR){
		var xmlDoc = $(response);
		console.log("This GET ajax responsed - " + obj.name);
		var nodes  = xmlDoc.find("#"+obj.findID)[0].childNodes;
		var html = "<label for=\"" + obj.setDivID + "\"> " + obj.setLabel + "</label> <br /> <ul>";
		for (i=1; i<nodes.length; i++) {
			var checked = "";
			if (nodes[i].getAttribute("selected") == "") {
				checked = " checked ";
				obj.curValue = nodes[i].value;
			}
			html += "<li> <input type=\"radio\" id=\"" + obj.setInputID + "\" value=\"" + nodes[i].value + "\"  name=\"" + obj.setInputID + "\" " + checked + " /> <label for=\"" + obj.setInputID + "\"> " + nodes[i].text + "</label> </li> \n";
		}
		html += "</ul>";
		$("#"+obj.setDivID).html(html);
	});
}

function getAllSettings() {
	$("#div-customize-message").html("");
	$("#btn-recommend-all-settings")[0].style.visibility = "visible";
	$("#btn-set-all-settings")[0].style.visibility = "visible";
	
	for (i=0; i<loadRadioArr.length; i++) { getRadioSetting(loadRadioArr[i]); }
	for (i=0; i<loadOptionArr.length; i++) { getOptionSetting(loadOptionArr[i]); }
}

/* Choose the recommended Settings on popup window, not xmlhttp request sent yet
----------------------------------*/

function recommendRadioSetting(obj) {
	obj.newValue = $("#"+obj.setFindID)[0].checked;
	if (obj.newValue !== obj.setRecommendValue) {
		$("#"+obj.setFindID)[0].click();
	}
}

function recommendOptionSetting(obj) {
	obj.newValue = $('input:radio[id=' + obj.setFindID + ']:checked').val();
	if (obj.newValue !== obj.setRecommendValue) {
		$('input:radio[id=' + obj.setFindID + '][value=' + obj.setRecommendValue + ']')[0].click();
	}
}

function recommendSettings() {
	for (i=0; i<loadRadioArr.length; i++) { recommendRadioSetting(loadRadioArr[i]); }
	for (i=0; i<loadOptionArr.length; i++) { recommendOptionSetting(loadOptionArr[i]); }
}

/* Submit user's Linkedin Settings, send xmlhttp request if value changes
----------------------------------*/

function setRadioSetting(obj, defaultFlag) {
	if (defaultFlag ==  true || $("#"+obj.setFindID)[0] == null) {
		obj.newValue = obj.setRecommendValue;
	} else {
		obj.newValue = $("#"+obj.setFindID)[0].checked;	
	}
	if (obj.newValue != obj.setRecommendValue) {returnDefaultFlag = false; }
	if (obj.newValue === obj.curValue) { return; }
	
	setValue = obj.newValue ? obj.setVarName : "";
	var params = "" + obj.setVarName + "=" + setValue + "&csrfToken=" + csrfToken;
	var request = $.ajax({
		url: obj.submitUrl,
		type: "POST",
		dataType: "HTML",
		data: params
	});

	return request.success(function (response, textStatus, jqXHR){
			var xmlDoc = $(response);
			console.log("This ajax responsed - " + obj.name);
			var msgElem  = xmlDoc.find("#global-error").find("strong")[0];
			obj.curValue = obj.newValue;
	});
}


function setOptionSetting(obj, defaultFlag) {
	obj.newValue = $('input:radio[id=' + obj.setFindID + ']:checked').val();
	if (defaultFlag == true || obj.newValue == null) {
		obj.newValue = obj.setRecommendValue;
	}
	if (obj.newValue != obj.setRecommendValue) {returnDefaultFlag = false; }
	if (obj.newValue === obj.curValue) { return; }
	
	var params = "" + obj.setVarName + "=" + obj.newValue + "&csrfToken=" + csrfToken;
	var request = $.ajax({
		url: obj.submitUrl,
		type: "POST",
		dataType: "HTML",
		data: params
	});

	return request.success(function (response, textStatus, jqXHR){
			var xmlDoc = $(response);
			console.log("This ajax responsed - " + obj.name);
			var msgElem  = xmlDoc.find("#global-error").find("strong")[0];
			obj.curValue = obj.newValue;
	});
}

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
	localStorage.removeItem('firstRun');
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
	
	if (!firstRun) {
		// Open the options page if this is the first run
		localStorage['firstRun'] = 'true';
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