//$.getScript("settings.js");

var loadRadioArr = [ab, bm, la, ri, pim, pih];
var loadOptionArr = [av, cv, ppv];

function getRadioSetting(url, findSettingID, setDivID, setInputID, setLabel, obj) {
	var xmlhttp = new XMLHttpRequest();
	var csrfToken = document.getElementById("csrfToken").value;
	var params = "csrfToken="+csrfToken;
	xmlhttp.open("GET", url, true);
	xmlhttp.withCredentials = true;
	xmlhttp.setRequestHeader("content-type", "application/x-www-form-urlencoded");
	xmlhttp.send(params);
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			var xmlDoc = $(xmlhttp.responseText);
			var msgElem  = xmlDoc.find("#"+findSettingID);
			if (msgElem[0].checked === true) {
				$("#"+setDivID).html("<input type=\"checkbox\" id=\"" + setInputID + "\" value=\"set\" checked> <label for=\"" + setInputID + "\"> " + setLabel + "</label> ");
				if (obj !== null) {
					obj.curValue = true;
				}
			} else {
				$("#"+setDivID).html("<input type=\"checkbox\" id=\"" + setInputID + "\" value=\"set\"> <label for=\"" + setInputID + "\"> " + setLabel + "</label> ");
				if (obj !== null) {
					obj.curValue = false;
				}
			}
		}
	}
}

function getOptionSetting(url, findSettingID, setDivID, setInputID, setLabel, obj) {
	var xmlhttp = new XMLHttpRequest();
	var csrfToken = document.getElementById("csrfToken").value;
	var params = "csrfToken="+csrfToken;
	xmlhttp.open("GET", url, true);
	xmlhttp.withCredentials = true;
	xmlhttp.setRequestHeader("content-type", "application/x-www-form-urlencoded");
	xmlhttp.send(params);
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			var xmlDoc = $(xmlhttp.responseText);
			var nodes  = xmlDoc.find("#"+findSettingID)[0].childNodes;
			var html = "<label for=\"" + setDivID + "\"> " + setLabel + "</label> <br />";
			for (i=1; i<nodes.length; i++) {
				var checked = "";
				if (nodes[i].getAttribute("selected") == "") {
					checked = " checked ";
					if (obj !== null) {
						obj.curValue = nodes[i].value;
					}
				}
				html += "<input type=\"radio\" id=\"" + setInputID + "\" value=\"" + nodes[i].value + "\"  name=\"" + setInputID + "\" " + checked + " /> <label for=\"" + setInputID + "\"> " + nodes[i].text + "</label> <br /> \n" ;
			}
			$("#"+setDivID).html(html);
		}
	}
}

function getAllSettings() {
	$("#div-error-messages").html("");
	var URL = "https://www.linkedin.com/settings/";		
	for (i=0; i<loadRadioArr.length; i++) {
		var e = loadRadioArr[i];
		var divname = (e.setName == null) ? "div-"+e.name : "div-"+e.setName;
		var inputname = (e.setName == null) ? "input-"+e.name : "input-"+e.setName;
		var getUrl = (e.getPath == null) ? URL+e.name : e.getPath;
		getRadioSetting(getUrl, e.findID, divname, inputname, e.setLabel, e);
	}
	for (i=0; i<loadOptionArr.length; i++) {
		var e = loadOptionArr[i];
		var getUrl = (e.getPath == null) ? URL+e.name : e.getPath;
		getOptionSetting(getUrl, e.findID, "div-"+e.name, "select-"+e.name, e.setLabel, e);
	}
}

function setRadioSetting(url, findSettingID, setVarName, setValue) {
  var checked = $('#'+ findSettingID)[0].checked;
	var xmlhttp = new XMLHttpRequest();
	var csrfToken = document.getElementById("csrfToken").value;
	setValue = checked ? setValue : "";
	var params = "" + setVarName + "=" + setValue + "&csrfToken=" + csrfToken;
	xmlhttp.open("POST", url, true);
	xmlhttp.withCredentials = true;
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send(params);

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			var response = xmlhttp.responseText;
			var xmlDoc = $(response);
			var msgElem  = xmlDoc.find("#global-error").find("strong")[0];
			$("#div-error-messages").append(msgElem);
			$("#div-error-messages").append(" for " + setVarName + "<br />");
			//return msgText;
		}
	};
}

function setOptionSetting(url, findSettingID, setVarName) {
	
  var setValue = $('input:radio[id=' + findSettingID + ']:checked').val();
	var xmlhttp = new XMLHttpRequest();
	var csrfToken = document.getElementById("csrfToken").value;
	var params = "" + setVarName + "=" + setValue + "&csrfToken=" + csrfToken;
	xmlhttp.open("POST", url, true);
	xmlhttp.withCredentials = true;
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send(params);

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			var response = xmlhttp.responseText;
			var xmlDoc = $(response);
			var msgElem  = xmlDoc.find("#global-error").find("strong")[0];
			$("#div-error-messages").append(msgElem);
			$("#div-error-messages").append(" for " + setVarName + "<br />");
			//return msgText;
		}
	};
}

function setAllSettings() {
	$("#div-error-messages").html("");
	var URL = "https://www.linkedin.com/settings/";
	
	for (i=0; i<loadRadioArr.length; i++) {
		var e = loadRadioArr[i];
		var inputname = (e.setName == null) ? "input-"+e.name : "input-"+e.setName;
		var submitUrl = (e.submitPath == null) ? URL+e.name : e.submitPath;
		e.newValue = $("#"+inputname)[0].checked;
		if (e.newValue !== e.curValue) {
			setRadioSetting(submitUrl+"-submit", inputname, e.setVarName, e.setVarName);
		} else {
			$("#div-error-messages").append(" Values did not change for <strong> " + e.name + "</strong> <br />");
		}
	}

	var loadOptionArr = [av, cv, ppv];
	for (i=0; i<loadOptionArr.length; i++) {
		var e = loadOptionArr[i];
		var submitUrl = (e.submitPath == null) ? URL+e.name : e.submitPath;
		var selectname = "select-"+e.name;
		e.newValue = setValue = $('input:radio[id=' + selectname + ']:checked').val();
		if (e.newValue !== e.curValue) {
			setOptionSetting(submitUrl+"-submit", selectname, e.setVarName);
		} else {
			$("#div-error-messages").append(" Values did not change for <strong> " + e.name + "</strong> <br />");
		}
	}
}


function onPageInfo(o) { 
	document.getElementById("csrfToken").value = o.csrfToken; 
} 

function test() {
	console.log("11111111 found xxxxxxxxxx ");
	$("#btn-set-all-settings").click(setAllSettings);
	$("#btn-get-all-settings").click(getAllSettings);
  var bg = chrome.extension.getBackgroundPage();
  bg.getPageInfo(onPageInfo);
}

window.onload = test;