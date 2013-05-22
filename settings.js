var ab = {
	"name": "activity-broadcasts",
	"findID":	"activity-activity-editActivityBroadcasts",
	"setLabel": "Activity broadcasts (Share your activity updates in your News Feed)",
	"setVarName": "activity",
	"setRecommendValue": false
};

var bm = {
	"name": "browse-map",
	"findID":	"browseMapParam-browseMapParam-browseMap",
	"setLabel": "Show side box: 'Viewers of your profile also viewed' ",
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

var pv = {
	"name": "edit-picture-info",
	"getPath": "https://www.linkedin.com/profile/edit-picture-info",
	"submitPath": "https://www.linkedin.com/profile/edit-picture-visibility",
	"findID":	"pictureVisibility",
	"setLabel": "Who can see your profile photo: ",
	"setVarName": "pictureVisibility",
	"setRecommendValue": "CONNECTIONS"
};

var cv = {
	"name": "connection-visibility",
	"findID":	"browseConnections-editBrowseConnections",
	"setLabel": "Who can see your connections: ",
	"setVarName": "browseConnections",
	"setRecommendValue": "ME"
};

var la = {
	"name": "li-announcements",
	"findID":	"liAnnouncementsParam-liAnnouncementsParam-editReceivingMarketing",
	"setLabel": "LinkedIn announcements",
	"setVarName": "liAnnouncementsParam",
	"setRecommendValue": false
};

var ri = {
	"name": "research-invitations",
	"findID":	"researchInvitationsParam-researchInvitationsParam-editResearchInvitations",
	"setLabel": "invitations to participate in LinkedIn research",
	"setVarName": "researchInvitationsParam",
	"setRecommendValue": false
};

var pim = {
	"name": "partner-inmail",
	"submitPath": "https://www.linkedin.com/settings/partner-inMail",
	"setName": "partner-inmail-marketing",
	"findID":	"marketingPartnerParam-marketingPartnerParam-editPartnerInMail",
	"setLabel": "information from LinkedIn Marketing Partners",
	"setVarName": "marketingPartnerParam",
	"setRecommendValue": false
};

var pih = {
	"name": "partner-inmail",
	"submitPath": "https://www.linkedin.com/settings/partner-inMail",
	"setName": "partner-inmail-hiring",
	"findID":	"hiringCampaignParam-hiringCampaignParam-editPartnerInMail",
	"setLabel": "information regarding LinkedIn job opportunities",
	"setVarName": "hiringCampaignParam",
	"setRecommendValue": false
};

var ppv = {
	"name": "profile-photo-visibility",
	"findID":	"profilePhotosParam-editProfilePhotos",
	"setLabel": "Select whose profile photos you would like to see",
	"setVarName": "profilePhotosParam",
	"setRecommendValue": "evr"
};

var ds = {
	"name": "data-sharing",
	"findID":	"dataSharingParam-dataSharingParam-dataSharing",
	"setLabel": "Share my data with third-party applications",
	"setVarName": "dataSharingParam",
	"setRecommendValue": false
};

var opm = {
	"name": "offsite-privacy-management",
	"findID":	"offsitePrivacyManagementParam-offsitePrivacyManagementParam-offsitePrivacyManagement",
	"setLabel": "Allow LinkedIn to collect my visited websites which included LinkedIn plugins",
	"setVarName": "offsitePrivacyManagementParam",
	"setRecommendValue": false
};

/* Messages to be used on LinkedIn Page and Extention popup page */
var LIHomeFirstCheck = "<div class='alert warning'>We are checking your settings now, please wait...</div>";
var LIHomeSuccess = "<div class='alert success'><p><strong>Well done.</strong>Your privacy settings are Good. </p></div>";
var LIHomeUpdating = "<div class='alert warning'>We are fixing your settings now, please wait...</div>";
var LIHomeBad = "<div class='alert warning'><p>You privacy settings may have problems. <a id='fixithref' href='#'> Fix it. </a></p></div>";
var LIHomeAtRisk = "<div class='alert warning'><p>You changed settings at own risk!</p></div>";

var MsgHomeFirstCheck = "<div class='alert alert-success'>Checking your Linkedin Settings now...</div>";
var MsgHomeSuccess = "<div class='alert alert-success'><strong>Well Done!</strong> Your privacy settings are secure.</div>";
var MsgHomeCustom = "<div class='alert'> Your customized privacy settings were updated, and may have problems.</div>";
var MsgHomeFix = "<div class='alert'> Fix your settings with our recommendation <input type='button' id='btn-set-recommend-settings' name='set-all-setting' value='Fix It'> </div>";

var MsgCustomFirstCheck = "<div class='alert alert-success'>We are fixing your settings now, please wait...</div>";
var MsgCustomSuccess = "<div class='alert alert-success'><strong>Cheers!</strong> Your privacy settings were updated with recommended choices!</div>";
var MsgCustomUpdate = "<div class='alert'> Your customized privacy settings were updated! </div>";

/* Variables to be used in background.js or contentscript.js */
var loadRadioArr = [ab, bm, la, ri, pim, pih, ds, opm];
var loadOptionArr = [av, pv, cv, ppv];
var URL = "https://www.linkedin.com/settings/";
var csrfToken = "";
var DOMAIN = 'barracudalabs.com';
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
	obj.setFindID = (obj.setName == null) ? "select-"+obj.name : "select-"+obj.setName;
	return obj;
}

(function prepareAllObjects() {
	for (i=0; i<loadRadioArr.length; i++) { prepareRadioObject(loadRadioArr[i]); }
	for (i=0; i<loadOptionArr.length; i++) { prepareOptionObject(loadOptionArr[i]); }
})();

/* Load user's Linkedin Settings, and display it properly in popup window
----------------------------------*/

function getRadioSetting(obj) {		
	$("#" + obj.setDivID).html("");
	
	var params = "csrfToken="+csrfToken;
	var request = $.ajax({ url: obj.getUrl, type: "GET", dataType: "HTML", data: params });
	
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
	var request = $.ajax({ url: obj.getUrl, type: "GET", dataType: "HTML", data: params });
	
	return request.success(function (response, textStatus, jqXHR){
		var xmlDoc = $(response);
		console.log("This GET ajax responsed - " + obj.name);
		var nodes  = null;
		if (xmlDoc.find("#"+obj.findID+" option").length > 0) {
			nodes = xmlDoc.find("#"+obj.findID+" option");
		} else if (xmlDoc.find("input:radio[name="+obj.findID+"]").length > 0) {
			nodes = xmlDoc.find("input:radio[name="+obj.findID+"]").toArray().reverse();
		}
		var html = "<label for=\"" + obj.setDivID + "\"> " + obj.setLabel + "</label> \n <ul>";
		for (i=0; i<nodes.length; i++) {
			var checked = "";
			if (nodes[i].getAttribute("selected") == "" || nodes[i].getAttribute("checked") == "") {
				checked = " checked ";
				obj.curValue = nodes[i].value;
			}
			displayText = (nodes[i].text || nodes[i].value.toLowerCase());
			if (displayText.indexOf("connections") == 0) {
				displayText = "Your " + displayText;
			} else if (displayText.indexOf("network") == 0) {
				displayText = "Your " + displayText;
			}	else if (displayText.indexOf("everyone") == 0) {
				displayText = "Everyone";
			}
			
			html += "<li> <input type=\"radio\" id=\"" + obj.setInputID + "\" value=\"" + nodes[i].value + "\"  name=\"" + obj.setInputID + "\" " + checked + " /> <label for=\"" + obj.setInputID + "\"> " + displayText + "</label> </li> \n";
		}
		html += "</ul> \n";
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
	console.log("old = " + obj.curValue + ", new = " + obj.newValue +" recommend " + obj.setRecommendValue);
	if (obj.newValue != obj.setRecommendValue) {returnDefaultFlag = false; }
	if (obj.newValue === obj.curValue) { return; }
	
	setValue = obj.newValue ? obj.setVarName : "";
	var params = "" + obj.setVarName + "=" + setValue + "&csrfToken=" + csrfToken;
	var request = $.ajax({ url: obj.submitUrl, type: "POST", dataType: "HTML", data: params });

	return request.success(function (response, textStatus, jqXHR){
			var xmlDoc = $(response);
			var msgElem  = xmlDoc.find("#global-error").find("strong")[0];
			obj.curValue = obj.newValue;
			console.log("This ajax responsed - " + obj.name + "msgelem " + msgElem + ", cur= " + obj.curValue);
	});
}

function setOptionSetting(obj, defaultFlag) {
	obj.newValue = $('input:radio[id=' + obj.setFindID + ']:checked').val();
	if (defaultFlag == true || obj.newValue == null) {
		obj.newValue = obj.setRecommendValue;
	}
	if (obj.newValue != obj.setRecommendValue) {returnDefaultFlag = false; }
	console.log("old = " + obj.curValue + ", new = " + obj.newValue +", recommend " + obj.setRecommendValue);
	if (obj.newValue === obj.curValue) { return; }
	
	var params = "" + obj.setVarName + "=" + obj.newValue + "&csrfToken=" + csrfToken;
	var request = $.ajax({ url: obj.submitUrl, type: "POST", dataType: "HTML", data: params });

	return request.success(function (response, textStatus, jqXHR){
			var xmlDoc = $(response);
			var msgElem  = xmlDoc.find("#global-error").find("strong")[0];
			obj.curValue = obj.newValue;
			console.log("This ajax responsed - " + obj.name + "msgelem " + msgElem + ", cur= " + obj.curValue);
	});
}