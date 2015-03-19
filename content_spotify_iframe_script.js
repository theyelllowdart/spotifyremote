var playButtons = document.getElementsByClassName('play-pause-btn');
if (playButtons.length > 0) {
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'play') {
      var evt = new CustomEvent("spotifyRemoteIFrame.play", {detail: request.song});
      document.dispatchEvent(evt);
    } else if(request.type === 'pause') {
      var evt = new CustomEvent("spotifyRemoteIFrame.pause");
      document.dispatchEvent(evt);
    }
  });

  document.addEventListener('spotifyRemoteIFrame.ready', function () {
    chrome.runtime.sendMessage({type: 'ready'});
  });

  document.addEventListener('spotifyRemoteIFrame.playModeChanged', function (event) {
    chrome.runtime.sendMessage({type: 'playModeChangedEvent', event: event.detail});
  });

  var injectionScript = document.createElement('script');
  injectionScript.src = chrome.extension.getURL('injected_spotify_iframe_script.js');
  (document.head || document.documentElement).appendChild(injectionScript);
}
