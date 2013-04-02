/*
 * Copyright (c) 2010 The Chromium Authors. All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */
// Object to hold information about the current page

var pageInfo = {
    "title": document.title,
    "url": window.location.href,
		"csrfToken": document.getElementById("nav-utility-auth").childNodes[0].href.split(/[=&]/)[3]
};


// Send the information back to the extension
chrome.extension.sendRequest(pageInfo);
