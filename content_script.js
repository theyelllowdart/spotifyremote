var spotifyPlayer = document.getElementById("spotify-player");

if (spotifyPlayer) {
  var evt = new CustomEvent("spotifyRemote.ready");
  spotifyPlayer.dispatchEvent(evt);

  spotifyPlayer.addEventListener('spotifyRemote.play', function (event) {
    chrome.runtime.sendMessage({type: 'play', song: event.detail});
  });

  spotifyPlayer.addEventListener('spotifyRemote.pause', function () {
    chrome.runtime.sendMessage({type: 'pause'});
  });
}
