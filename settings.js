var ab = {
	"name": "activity-broadcasts",
	"findID":	"activity-activity-editActivityBroadcasts",
	"setLabel": "Let people know your activities",
	"setVarName": "activity",
	"setRecommendValue": false
};

var bm = {
	"name": "browse-map",
	"findID":	"browseMapParam-browseMapParam-browseMap",
	"setLabel": "Show people viewed your profile also viewed",
	"setVarName": "browseMapParam",
	"setRecommendValue": false
};

var av = {
	"name": "activity-visibility",
	"findID":	"activityFeed-editActivityFeed",
	"setLabel": "Who can see your activity feed: ",
	"setVarName": "activityFeed",
	"setRecommendValue": "CONNECTIONS"
};

var cv = {
	"name": "connection-visibility",
	"findID":	"browseConnections-editBrowseConnections",
	"setLabel": "Who can see your connection: ",
	"setVarName": "browseConnections",
	"setRecommendValue": "ME"
};

var la = {
	"name": "li-announcements",
	"findID":	"liAnnouncementsParam-liAnnouncementsParam-editReceivingMarketing",
	"setLabel": "Get Linkedin announcement ",
	"setVarName": "liAnnouncementsParam",
	"setRecommendValue": false
};

var ri = {
	"name": "research-invitations",
	"findID":	"researchInvitationsParam-researchInvitationsParam-editResearchInvitations",
	"setLabel": "Invitations to participate in research",
	"setVarName": "researchInvitationsParam",
	"setRecommendValue": false
};

var pim = {
	"name": "partner-inmail",
	"submitPath": "https://www.linkedin.com/settings/partner-inMail",
	"setName": "partner-inmail-marketing",
	"findID":	"marketingPartnerParam-marketingPartnerParam-editPartnerInMail",
	"setLabel": "Linkedin's Marketing partners may send you information",
	"setVarName": "marketingPartnerParam",
	"setRecommendValue": false
};

var pih = {
	"name": "partner-inmail",
	"submitPath": "https://www.linkedin.com/settings/partner-inMail",
	"setName": "partner-inmail-hiring",
	"findID":	"hiringCampaignParam-hiringCampaignParam-editPartnerInMail",
	"setLabel": "Linkedin's hiring campaign may send you information",
	"setVarName": "hiringCampaignParam",
	"setRecommendValue": false
};

var ppv = {
	"name": "profile-photo-visibility",
	"findID":	"profilePhotosParam-editProfilePhotos",
	"setLabel": "Select whose photos you would like to see",
	"setVarName": "profilePhotosParam",
	"setRecommendValue": "evr"
};

var loadRadioArr = [ab, bm, la, ri, pim, pih];
var loadOptionArr = [av, cv, ppv];
var URL = "https://www.linkedin.com/settings/";		
var csrfToken = "";
var DOMAIN = 'barracudalabs.com';

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