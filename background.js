chrome.runtime.onMessage.addListener(function (request, sender) {
  if (request.type === 'spotifyLoaded') {
    chrome.tabs.executeScript(sender.tab.id, {allFrames: true, file: "content_spotify_iframe_script.js"});
  } else if (request.type === 'ready') {
    chrome.tabs.sendMessage(sender.tab.id, request)
  } else if (request.type === 'playModeChangedEvent') {
    chrome.tabs.sendMessage(sender.tab.id, request)
  } else if (request.type === 'play') {
    chrome.tabs.sendMessage(sender.tab.id, request)
  } else if (request.type === 'pause') {
    chrome.tabs.sendMessage(sender.tab.id, request)
  }
});
