chrome.contextMenus.create({
    "title": "Hide/Tint this title",
    "id": "Remove",
    "contexts": ["all"],
    "documentUrlPatterns": ["*://*.netflix.com/*"]
});
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, info.menuItemId);
    });
});
