var spotifyPlayer = document.getElementById("spotify-player");

if (spotifyPlayer) {
  chrome.runtime.onMessage.addListener(function (request) {
    if (request.type === 'handshake') {
      var evt = new CustomEvent("spotifyConsumer.handshake");
      spotifyPlayer.dispatchEvent(evt);
    }
  });

  var evt = new CustomEvent("spotifyRemote.ready");
  spotifyPlayer.dispatchEvent(evt);

  spotifyPlayer.addEventListener('spotifyRemote.handshake', function () {
    chrome.runtime.sendMessage({type: 'handshake'});
  });

  spotifyPlayer.addEventListener('spotifyRemote.play', function (event) {
    chrome.runtime.sendMessage({type: 'play', song: event.detail});
  });

  spotifyPlayer.addEventListener('spotifyRemote.pause', function () {
    chrome.runtime.sendMessage({type: 'pause'});
  });
}
