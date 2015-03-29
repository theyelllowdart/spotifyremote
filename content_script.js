var spotifyPlayer = document.getElementById("spotify-player");

if (spotifyPlayer) {
  chrome.runtime.onMessage.addListener(function (request) {
    if (request.type === 'ready') {
      var evt = new CustomEvent("spotifyRemote.ready");
      spotifyPlayer.dispatchEvent(evt);
    } else if (request.type === 'playModeChangedEvent') {
      var evt = new CustomEvent("spotifyRemote.playModeChanged");
      spotifyPlayer.dispatchEvent(evt);
    }
  });

  spotifyPlayer.addEventListener('load', function () {
    chrome.runtime.sendMessage({type: 'spotifyLoaded'});
  });

  spotifyPlayer.addEventListener('spotifyRemote.play', function (event) {
    chrome.runtime.sendMessage({type: 'play', song: event.detail});
  });

  spotifyPlayer.addEventListener('spotifyRemote.pause', function () {
    chrome.runtime.sendMessage({type: 'pause'});
  });
}
