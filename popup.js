
function getRadioSetting(url, findSettingID, setDivID, setInputID, setLabel) {
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
			} else {
				$("#"+setDivID).html("<input type=\"checkbox\" id=\"" + setInputID + "\" value=\"set\"> <label for=\"" + setInputID + "\"> " + setLabel + "</label> ");
			}
		}
	}
}

function getOptionSetting(url, findSettingID, setDivID, setInputID, setLabel) {
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
				}
				html += "<input type=\"radio\" id=\"" + setInputID + "\" value=\"" + nodes[i].value + "\"  name=\"" + setInputID + "\" " + checked + " /> <label for=\"" + setInputID + "\"> " + nodes[i].text + "</label> <br /> \n" ;
			}
			$("#"+setDivID).html(html);
		}
	}
}

function getAllSettings() {
	$("#div-error-messages").html("");
	
	var url = "https://www.linkedin.com/settings/activity-broadcasts";
	var findID = "activity-activity-editActivityBroadcasts";
	var setDivID = "div-activity-broadcasts";
	var setInputID = "input-activity-broadcasts";
	var setLabel = "Show acvitity broadcasting";
	getRadioSetting(url, findID, setDivID, setInputID, setLabel);
	
	var url2 = "https://www.linkedin.com/settings/browse-map";
	var findID2 = "browseMapParam-browseMapParam-browseMap";
	var setDivID2 = "div-browseparam-browsemap";
	var setInputID2 = "input-browseparam-browsemap";
	var setLabel2 = "Show people viewed your profile also viewed";
	getRadioSetting(url2, findID2, setDivID2, setInputID2, setLabel2);
	
	var url3 = "https://www.linkedin.com/settings/activity-visibility";
	var findID3 = "activityFeed-editActivityFeed";
	var setDivID3 = "div-activityfeed-activityfeed";
	var setSelectID3 = "select-activityfeed-activityfeed";
	var setLabel3 = "Who can see your activity feed: ";
	getOptionSetting(url3, findID3, setDivID3, setSelectID3, setLabel3);
}

function setRadioSetting(url, findSettingID, setVariableName, setValue) {
  var checked = $('#'+ findSettingID)[0].checked;
	var xmlhttp = new XMLHttpRequest();
	var csrfToken = document.getElementById("csrfToken").value;
	setValue = checked ? setValue : "";
	var params = "" + setVariableName + "=" + setValue + "&csrfToken=" + csrfToken;
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
			$("#div-error-messages").append(" for " + setVariableName + "<br />");
			//return msgText;
		}
	};
}

function setOptionSetting(url, findSettingID, setVariableName) {
	
  var setValue = $('input:radio[id=' + findSettingID + ']:checked').val();
	var xmlhttp = new XMLHttpRequest();
	var csrfToken = document.getElementById("csrfToken").value;
	var params = "" + setVariableName + "=" + setValue + "&csrfToken=" + csrfToken;
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
			$("#div-error-messages").append(" for " + setVariableName + "<br />");
			//return msgText;
		}
	};
}

function setAllSettings() {
	$("#div-error-messages").html("");
	
	var url = "https://www.linkedin.com/settings/activity-broadcasts-submit";
	var findID = "input-activity-broadcasts";
	var setVariableName = "activity";
	var setValue = "activity";
	setRadioSetting(url, findID, setVariableName, setValue);
	
	var url2 = "https://www.linkedin.com/settings/browse-map-submit";
	var findID2 = "input-browseparam-browsemap";
	var setVariableName2 = "browseMapParam";
	var setValue2 = "browseMapParam";
	setRadioSetting(url2, findID2, setVariableName2, setValue2);
	
	var url3 = "https://www.linkedin.com/settings/activity-visibility-submit";
	var findID3 = "select-activityfeed-activityfeed";
	var setVariableName3 = "activityFeed";
	setOptionSetting(url3, findID3, setVariableName3);
	
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