//$.getScript("settings.js");
var loadRadioArr = [ab, bm, la, ri, pim, pih];
var loadOptionArr = [av, cv, ppv];
var URL = "https://www.linkedin.com/settings/";		
var csrfToken = "";
var DOMAIN = 'barracudalabs.com';

var firstRun = (localStorage['firstRun'] == 'true');
var lastRecommendSetTime = localStorage['lastRecommendSetTime'];

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
	
	var xmlhttp = new XMLHttpRequest();
	//var csrfToken = document.getElementById("csrfToken").value;
	var params = "csrfToken="+csrfToken;
	xmlhttp.open("GET", obj.getUrl, true);
	xmlhttp.withCredentials = true;
	xmlhttp.setRequestHeader("content-type", "application/x-www-form-urlencoded");
	xmlhttp.send(params);
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			var xmlDoc = $(xmlhttp.responseText);
			var msgElem  = xmlDoc.find("#" + obj.findID);
			var checked = "";
			obj.curValue = false;
			if (msgElem[0].checked === true) {
				obj.curValue = true;
				checked = "checked";
			}
			$("#" + obj.setDivID).html("<input type=\"checkbox\" id=\"" + obj.setInputID + "\" value=\"set\" " + checked + "> <label for=\"" + obj.setInputID + "\"> " + obj.setLabel + "</label> ");
		}
	}
}

function getOptionSetting(obj) {	
	$("#" + obj.setDivID).html("");
	
	var xmlhttp = new XMLHttpRequest();
	//var csrfToken = document.getElementById("csrfToken").value;
	var params = "csrfToken="+csrfToken;
	xmlhttp.open("GET", obj.getUrl, true);
	xmlhttp.withCredentials = true;
	xmlhttp.setRequestHeader("content-type", "application/x-www-form-urlencoded");
	xmlhttp.send(params);
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			var xmlDoc = $(xmlhttp.responseText);
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
		}
	}
}

function getAllSettings() {
	$("#div-customize-message").html("");
	$("#btn-recommend-all-settings")[0].style.visibility = "visible";
	$("#btn-set-all-settings")[0].style.visibility = "visible";
	
	for (i=0; i<loadRadioArr.length; i++) { getRadioSetting(loadRadioArr[i]); }
	for (i=0; i<loadOptionArr.length; i++) { getOptionSetting(loadOptionArr[i]); }
}

/* Submit user's Linkedin Settings, send xmlhttp request if value changes
----------------------------------*/

function setRadioSetting2(obj) {
	if ($("#"+obj.setFindID)[0] == null) {
		obj.newValue = obj.setRecommendValue;
	} else {
		obj.newValue = $("#"+obj.setFindID)[0].checked;	
	}
	if (obj.newValue === obj.curValue) {
		//$("#div-customize-message").append(" No change for <strong> " + (obj.setName || obj.name) + "</strong> <br />");
		return; 
	}
	var xmlhttp = new XMLHttpRequest();
	//var csrfToken = document.getElementById("csrfToken").value;
	setValue = obj.newValue ? obj.setVarName : "";
	var params = "" + obj.setVarName + "=" + setValue + "&csrfToken=" + csrfToken;
	xmlhttp.open("POST", obj.submitUrl, true);
	xmlhttp.withCredentials = true;
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send(params);

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			var response = xmlhttp.responseText;
			var xmlDoc = $(response);
			var msgElem  = xmlDoc.find("#global-error").find("strong")[0];
			obj.curValue = obj.newValue;
			//$("#div-customize-message").append(msgElem);
			//$("#div-customize-message").append(" for " + obj.setVarName + "<br />");
		}
	};
}

function setRadioSetting(obj) {
	if ($("#"+obj.setFindID)[0] == null) {
		obj.newValue = obj.setRecommendValue;
	} else {
		obj.newValue = $("#"+obj.setFindID)[0].checked;	
	}
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
			//$("#div-customize-message").append(msgElem);
			//$("#div-customize-message").append(" for " + obj.setVarName + "<br />");
	});
}


function setOptionSetting(obj) {
	obj.newValue = $('input:radio[id=' + obj.setFindID + ']:checked').val();
	if (obj.newValue == null) { obj.newValue = obj.setRecommendValue; }
	if (obj.newValue === obj.curValue) { return;  }
	
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

function setAllSettings() {
	$("#div-customize-message").html("<div class='alert alert-success'>We are fixing your settings now, please wait...</div>");
	var deferreds = [];
	for (i=0; i<loadRadioArr.length; i++) { 
		deferreds.push(setRadioSetting(loadRadioArr[i]));
	}
	for (i=0; i<loadOptionArr.length; i++) { 
		deferreds.push(setOptionSetting(loadOptionArr[i]));
	}
	localStorage['lastRecommendSetTime'] = new Date().toString().replace(/ GMT.*$/, "");
	
	$.when(deferreds).done(function() {
		$("#div-customize-message").html("<div class='alert alert-success'>We have fixed all your privacy settings! Cheers!</div>");
		$("#div-home-message").html("<div class='alert alert-success'>You have customized your settings on " + lastRecommendSetTime+"</div>");
	});
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
	localStorage.removeItem('lastRecommendSetTime');
}

function mainFunction() {
	console.log("--- Starting main function call ");
	prepareAllObjects();
	
	console.log("--- Object prepared ready, get csrfToken now");
  var bg = chrome.extension.getBackgroundPage();
  bg.getPageInfo(onPageInfo);
	console.log("--- Binding the function to buttons now");
	
	$("#btn-get-all-settings").click(getAllSettings);
	//$("#btn-get-all-settings").click();
	
	$("#btn-recommend-all-settings").click(recommendSettings);
	$("#btn-recommend-all-settings")[0].style.visibility = "hidden";	
	//$("#btn-recommend-all-settings").click();
	
	$("#btn-set-all-settings").click(setAllSettings);
	$("#btn-set-all-settings")[0].style.visibility = "hidden";
	
	$("#btn-delete-local-storage").click(deleteLocalStorage);
	
	if (!firstRun) {
		// Open the options page if this is the first run
		localStorage['firstRun'] = 'true';
		console.log("--- First Time RUN: will send settings with recommended values");
		$("#div-home-message").html("<div class='alert alert-success'>We are checking your Linkedin Settings now...</div>");
		setTimeout(function () {
			if (csrfToken !== "") {
				console.log("--- .5 seconds over, sent settings with recommended values");
				$("#btn-set-all-settings").click();	
			}
		}, 500);
	};
	
	if ( lastRecommendSetTime != null ) {
		$("#div-home-message").html("<div class='alert alert-success'>We have fixed your settings on " + lastRecommendSetTime+"</div>");
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
		if (id.match(/twitter/g) !== null) {
			js.src = "https://platform.twitter.com/widgets.js";
		} else if (id.match(/facebook/g) !== null) {
			js.src = "https://connect.facebook.net/en_US/all.js#xfbml=1&appId=246371008742609";
		}
		fjs.parentNode.insertBefore(js, fjs);
	}
};
social(document, "script", "twitter-wjs");
social(document, 'script', 'facebook-jssdk');

//Facebook javascript
/*
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/all.js#xfbml=1&appId=246371008742609";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk')); */