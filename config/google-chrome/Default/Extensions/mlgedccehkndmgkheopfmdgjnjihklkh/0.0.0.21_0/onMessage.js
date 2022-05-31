const extUrl = "https://www.bing.com/browserextension/xbox";
const topSitesPermissions = ['topSites'];
const topSitesKey = "topSites";

chrome.runtime.onMessageExternal.addListener( function(request, sender, sendResponse) {
    if (sender && sender.url && sender.url.toLowerCase().includes(extUrl)) {
		if (request.hasPermission === topSitesKey) {
			chrome.permissions.contains( 
			    { permissions: topSitesPermissions }, 
				granted => sendResponse({topSitesPermission: granted})
			);		
		} 	
		else if (request.requestPermission === topSitesKey) {
			chrome.permissions.request(
				{ permissions: topSitesPermissions }, 
				granted => sendResponse({topSitesPermission: granted})
			);
		}	
		else if (request.removePermission === topSitesKey) {
			chrome.permissions.remove( 
			    { permissions: topSitesPermissions }, 
				removed => sendResponse({topSitesPermission: !removed})
			);
		}	
		else if (request.data === topSitesKey && chrome.topSites) {
			chrome.topSites.get(data => sendResponse({topSites: data}));
		} 
    }
    return true;
});

