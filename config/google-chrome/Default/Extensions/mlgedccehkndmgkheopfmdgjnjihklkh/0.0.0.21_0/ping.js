var manifestData = chrome.runtime.getManifest();
var extensionVersion = manifestData.version;
var bingUrl = "https://www.bing.com/";

var FeedbackFwlink = "https://go.microsoft.com/fwlink/?linkid=2138838";
var ExtnLanguage = chrome.i18n.getMessage("ExtnLanguage");
var ExtensionId = chrome.runtime.id;
var MachineID = (localStorage.MachineID == undefined || localStorage.MachineID == "" || localStorage.MachineID == null) ? guid() : localStorage.MachineID;

//To redirect feedback page while uninstalling the extension
var uninstallUrl = FeedbackFwlink + "&extnID=" + ExtensionId +"&mkt=" + ExtnLanguage + "&mid=" + MachineID + "&br=gc";
chrome.runtime.setUninstallURL(uninstallUrl);

//Sets '_DPC' session cookie in bing.com domain whenever background.js gets executed
setTimeout(function () {
    const _dpc = localStorage["_dpc"];
    const beTheme = localStorage["BrowserExtensionTheme"];
    let _bec = '';
    
    chrome.cookies.get({ url: bingUrl, name: '_BEC' }, function (cookie) {
        if (cookie) {
            _bec = cookie.value;
        }
        
        if (beTheme) {
            _bec = addBeTheme(_bec, beTheme);
            if (_bec != undefined && _bec != "" && _bec != null) {
                setBecCookie(_bec);
            }
        }
    });
    
    if (_dpc != undefined && _dpc != "" && _dpc != null) {
        chrome.cookies.set({ url: bingUrl, domain: '.bing.com', name: '_DPC', value: _dpc }, function (cookie) {
        });
    }
}, 500);

chrome.runtime.onInstalled.addListener(function (details) {
    var defaultPC = "U549";
    var browserDefaultsUrl = "https://browserdefaults.microsoft.com/";

    if (details.reason == 'install') {
        //Sets the default pc of the extension in local storage
        localStorage["pc"] = defaultPC;
        localStorage["isNotifEnabled"] = true;

        // Fetching PC cookie value from browserdefaults.microsoft.com, store it in localStorage and clear the PC cookie in browserdefaults.microsoft.com
        chrome.cookies.get({ url: browserDefaultsUrl, name: 'pc' }, function (cookie) {
            if (cookie) {
                localStorage["_dpc"] = cookie.value;
                chrome.cookies.set({ url: bingUrl, domain: '.bing.com', name: '_DPC', value: localStorage["_dpc"] }, function (cookie) {
                });
                chrome.cookies.remove({ url: browserDefaultsUrl, name: 'pc' });
            }
        });
        
        // Fetching _bec cookie value from browserdefaults.microsoft.com, store it in localStorage and clear the _bec cookie in browserdefaults.microsoft.com
         chrome.cookies.get({ url: browserDefaultsUrl, name: '_bec' }, function (cookie) {
            if (cookie) {
                localStorage["BrowserExtensionTheme"] = "T=" + cookie.value.toUpperCase();
                setBecCookie(localStorage["BrowserExtensionTheme"]);
                chrome.cookies.remove({ url: browserDefaultsUrl, name: '_bec' });
            }
        });

        if (!localStorage["channel"]) {
            chrome.cookies.get({ url: browserDefaultsUrl, name: 'channel' }, function (cookie) {
                // Fetching channel cookie value, store it in localStorage and clear the Channel cookie in browserdefaults.microsoft.com
                if (cookie) {
                    let channel = cookie.value;
                    localStorage["channel"] = channel;
                    chrome.cookies.remove({ url: browserDefaultsUrl, name: 'channel' });
                }
            });
        }

        //Call for Install Ping
        SendPingDetails("1");

      setTimeout(function () {
            var redirectionURL = "https://go.microsoft.com/fwlink/?linkid=2128904&trackingid=" + chrome.runtime.id + "&partnercode=" + defaultPC + "&browser=gc" + "&mkt=" + ExtnLanguage;
            if (localStorage["channel"] != undefined && localStorage["channel"] != "" && localStorage["channel"] != null) {
                redirectionURL += "&channel=" + localStorage["channel"];
            }
 
			if (localStorage["MachineID"] != undefined && localStorage["MachineID"] != "" && localStorage["MachineID"] != null) {
                redirectionURL += "&machineid=" + localStorage["MachineID"];
            }
 
            chrome.tabs.create({ url: redirectionURL });
        }, 300);

    }
    else if (details.reason == 'update') {
        //For existing users, if the 'pc' is available in localStorage and the same is not the default one, 
        //store the value under '_dpc' localStorage and replace the 'pc' localStorage with the default one
        if (localStorage["pc"] != defaultPC) {
            localStorage["_dpc"] = localStorage["pc"];
            localStorage["pc"] = defaultPC;
        }

        //Call for Update Ping
        SendPingDetails("3");
    }
});

chrome.tabs.onActivated.addListener(function () {
    if (localStorage.PingDate == "" || localStorage.PingDate != new Date().toDateString()) {
        //Call for Update Ping
        SendPingDetails("2");
        localStorage["PingDate"] = new Date().toDateString()
    }
});

/* Function to create an unique machine id */
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    var MachineGUID = s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
    MachineGUID = MachineGUID.toLocaleUpperCase();
    localStorage["MachineID"] = MachineGUID;
    return MachineGUID;
}

function SendPingDetails(status) {

    var startIndex = navigator.userAgent.indexOf("(");
    var endIndex = navigator.userAgent.indexOf(")");
    var OS = navigator.userAgent.substring(startIndex + 1, endIndex).replace(/\s/g, '');

    var browserLanguage = navigator.language;

    var ExtensionName = manifestData.name.replace(/ /g, "").replace('&', 'and');

    var BrowserVersion = navigator.userAgent.substr(navigator.userAgent.indexOf("Chrome")).split(" ")[0].replace("/", "");

    var MUID = "";
    chrome.cookies.get({ url: bingUrl, name: 'MUID' }, function (cookie) {
        if (cookie && cookie.value != "" && cookie.value != null) {
            MUID = cookie.value;
        }
    });

    setTimeout(function () {
        var pc = localStorage.pc == undefined || localStorage.pc == "" || localStorage.pc == null ? "UWDF" : localStorage.pc;
        var pingURL = 'http://g.ceipmsn.com/8SE/44?';
        var tVData = 'TV=is' + pc + '|pk' + ExtensionName + '|tm' + browserLanguage + '|bv' + BrowserVersion + '|ex' + ExtensionId + '|es' + status;
        if (MUID != "")
            tVData = tVData + "|mu" + MUID;
        if (localStorage["channel"])
            tVData = tVData + "|ch" + localStorage["channel"];
        if (localStorage["_dpc"])
            tVData = tVData + "|dp" + localStorage["_dpc"];
        pingURL = pingURL + 'MI=' + MachineID + '&LV=' + extensionVersion + '&OS=' + OS + '&TE=37&' + tVData;
        pingURL = encodeURI(pingURL);  // For HTML Encoding
        var xhr = new XMLHttpRequest();
        xhr.open("GET", pingURL, true);
        xhr.send();
    }, 500);
};

function addBeTheme(_bec, beTheme) {
    if (!_bec) {
        return beTheme;
    }

    const beThemeRegex = /T=([^=&]*)/i;
    _bec = _bec.replace(beThemeRegex, beTheme);
    
    return _bec.includes(beTheme) ? _bec : _bec + '&' + beTheme;
}

function getCookieExpirationDate() {
    // 390 days is allowed max age for cookies
    var maxage = 390 * 24 * 3600 * 1000;
    var expirationDate = new Date(new Date().getTime() + maxage);
    return Math.floor(expirationDate.getTime() / 1000); // seconds from epoch time
}

function setBecCookie(cookieValue) {
    chrome.cookies.set({
        url: bingUrl,
        domain: '.bing.com',
        name: '_BEC',
        expirationDate: getCookieExpirationDate(),
        sameSite: 'no_restriction',
        secure: true,
        value: cookieValue
    }, function(cookie) {});
}