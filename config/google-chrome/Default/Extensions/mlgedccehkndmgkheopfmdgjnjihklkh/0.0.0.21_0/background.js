var newTabUrl = "https://www.bing.com/BrowserExtension/Xbox?origin=ext&pc=U549&FORM=U549DF";

chrome.management.onEnabled.addListener(function (ExtensionInfo) {
	
    if (ExtensionInfo.id !== chrome.runtime.id) {
        return;
	}

    if (!localStorage["BingDefaultsSet"]) {
        localStorage["BingDefaultsSet"] = "done";
    }
});

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.create({url: newTabUrl});
});
