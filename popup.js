
function toggleEnabled()
{
  var value = $('input[@name="choice"]:checked').val();
	var xmlhttp = new XMLHttpRequest();
	//xmlhttp.open("GET", "https://www.linkedin.com/settings/activity-broadcasts?goback=%2Enas_*1_*1_*1", true);
	var url = "https://www.linkedin.com/settings/activity-broadcasts-submit";
	var csrfToken = document.getElementById("csrfToken").value;
	var activity = (value == "High" ? "activity" : "");
	var params = "activity="+activity+"&updateBroadcastSettings=Save%20changes&csrfToken="+csrfToken;
	xmlhttp.open("POST", url, true);
	xmlhttp.withCredentials = true;
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send(params);

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			var response = xmlhttp.responseText;
			var xmlDoc = $(response);
			var msgElem  = xmlDoc.find("#global-error").find("strong")[0];
			var msgText = $(msgElem).html();
			document.body.innerHTML = msgText;
		}
	};
}

function onPageInfo(o) { 
	document.getElementById("title").value = o.title; 
	document.getElementById("url").value = o.url; 
	document.getElementById("csrfToken").value = o.csrfToken; 
} 

function test() {
  // Attach event listeners
	console.log("11111111 found xxxxxxxxxx ");
  $("#setLevel").click(toggleEnabled);
  var bg = chrome.extension.getBackgroundPage();
  bg.getPageInfo(onPageInfo);
}

window.onload = test;