chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
  chrome.tabs.executeScript(null, { file: "secretvars.js" });
  chrome.tabs.executeScript(null, { file: "yt.js" });
});
