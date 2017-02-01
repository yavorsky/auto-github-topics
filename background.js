const repoRegExp = /github.com\/(\w|\-|\_|\.)+\/(\w|\-|\_|\.)+$/;

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (repoRegExp.test(tab.url) && changeInfo.status === 'complete') {
    try {
      // chrome.tabs.executeScript(null, {file: "topics.js"});
    } catch (e) {
      console.warn(e);
    }
  }
});

// On extension's icon click run parser and generate links
// chrome.pageAction.onClicked.addListener(function(tab) {
//     chrome.tabs.executeScript(null, {file: "impl.js"});
// });
