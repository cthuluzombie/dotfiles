var connectionUrl = "https://www.bing.com/favicon.ico?_=" + new Date().getTime();
var bingUrl = "https://www.bing.com/BrowserExtension/Xbox?origin=ext&pc=U549&FORM=U549DF";
var defaultUrl = "defaultHomePage.html";
var bingDomain = "https://www.bing.com";


window.onload = function(){
    document.title = chrome.i18n.getMessage("newtabPageTitle");
    loadNewTab();
};

function setNewTabPage(online) {
    var newTabFrame = document.getElementById("ntp-frame");
    if(online && newTabFrame)
    {
        newTabFrame.src = bingUrl;
    }
    else
    {
        newTabFrame.src = defaultUrl;
    }
}

function loadNewTab(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", connectionUrl);
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.onreadystatechange = function(){
        if(xhr.readyState === XMLHttpRequest.DONE){
            if(xhr.status >= 200 && (xhr.status < 300 || xhr.status === 304))
            {
                setNewTabPage(true);
            }
            else{
                setNewTabPage(false);
            }
        }
    };
    xhr.send();
}