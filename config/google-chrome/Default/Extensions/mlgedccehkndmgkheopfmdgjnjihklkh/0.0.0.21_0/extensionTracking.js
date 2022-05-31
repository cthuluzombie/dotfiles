var tacticId = "104" //XID of the extension refer:https://msasg.visualstudio.com/Bing_UX/_git/UUGrowth?path=%2Fprivate%2FEngagementConfig%2FDashboardConfigs%2FExtensionIdMetadata.tsv
var ACTIVEUSER_LOG_ALARM = "ActiveUserLogEntryAlarm";
var pollPeriodInMins = 60;


function logInstallEvent(tacticId)  {
  consoleLog('Logging install event');
    fetchBrowserExt(tacticId, '1');
    // Log Active User event every day.
    chrome.alarms.create(ACTIVEUSER_LOG_ALARM, {
      delayInMinutes: 1,
      periodInMinutes: pollPeriodInMins
    });
}

function consoleLog (message)  {
    if ( chrome.runtime.getManifest().version === '0.0.0') {
      console.log('Dev Debug:' + message);
    }
  }

  // ExtensionAction mapping: 1 -> InstallEvent 2 -> ActivePollStatus
function fetchBrowserExt (tacticId, extensionAction) {  
    fetch('https://www.bing.com/notifications/extension/handle?xid='+tacticId+'&action='+extensionAction)
    .then((e) => {
      consoleLog('Extension status updated in object store for action ' + extensionAction);
    })
    .catch((e) => { consoleLog('Excpetion while updating extension status'); });
};


chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
      setTimeout(logInstallEvent, 600, tacticId);
    }
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === ACTIVEUSER_LOG_ALARM) {
        fetchBrowserExt(tacticId, '2');
    }
});
