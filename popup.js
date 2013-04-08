//$.getScript("settings.js");

var loadRadioArr = [ab, bm, la, ri, pim, pih];
var loadOptionArr = [av, cv, ppv];
var URL = "https://www.linkedin.com/settings/";		
var csrfToken = "";


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
				html += "<input type=\"radio\" id=\"" + obj.setInputID + "\" value=\"" + nodes[i].value + "\"  name=\"" + obj.setInputID + "\" " + checked + " /> <label for=\"" + obj.setInputID + "\"> " + nodes[i].text + "</label> <br /> \n";
			}
			html += "</ul>";
			$("#"+obj.setDivID).html(html);
		}
	}
}

function getAllSettings() {
	$("#div-error-messages").html("");
	$("#btn-recommend-all-settings")[0].style.visibility = "visible";
	$("#btn-set-all-settings")[0].style.visibility = "visible";
	
	for (i=0; i<loadRadioArr.length; i++) { getRadioSetting(loadRadioArr[i]); }
	for (i=0; i<loadOptionArr.length; i++) { getOptionSetting(loadOptionArr[i]); }
}

/* Submit user's Linkedin Settings, send xmlhttp request if value changes
----------------------------------*/

function setRadioSetting(obj) {
	if ($("#"+obj.setFindID)[0] == null) {
		obj.newValue = obj.setRecommendValue;
	} else {
		obj.newValue = $("#"+obj.setFindID)[0].checked;	
	}
	if (obj.newValue === obj.curValue) {
		//$("#div-error-messages").append(" No change for <strong> " + (obj.setName || obj.name) + "</strong> <br />");
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
			$("#div-progress-messages").html("");
			$("#div-error-messages").append(msgElem);
			$("#div-error-messages").append(" for " + obj.setVarName + "<br />");
		}
	};
}

function setOptionSetting(obj) {
	obj.newValue = $('input:radio[id=' + obj.setFindID + ']:checked').val();
	if (obj.newValue == null) {
		obj.newValue = obj.setRecommendValue;
	}
	if (obj.newValue === obj.curValue) {
		//$("#div-error-messages").append(" No change for <strong> " + (obj.setName || obj.name) + "</strong> <br />");
		return; 
	}
	
	var xmlhttp = new XMLHttpRequest();
	//var csrfToken = document.getElementById("csrfToken").value;
	var params = "" + obj.setVarName + "=" + obj.newValue + "&csrfToken=" + csrfToken;
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
			$("#div-progress-messages").html("");
			$("#div-error-messages").append(msgElem);
			$("#div-error-messages").append(" for " + obj.setVarName + "<br />");
		}
	};
}

function setAllSettings() {
	$("#div-error-messages").html("");
	$("#div-progress-messages").html("");
	
	for (i=0; i<loadRadioArr.length; i++) { setRadioSetting(loadRadioArr[i]); }
	for (i=0; i<loadOptionArr.length; i++) { setOptionSetting(loadOptionArr[i]); }
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
	setTimeout(function () {
		if (csrfToken !== "") {
			console.log("--- .5 seconds over, sent settings with recommended values");
			$("#btn-set-all-settings").click();	
		}
	}, 500);
}

window.onload = mainFunction;