(function () {
  window.SPR.addPlayModeChangedListener(function (event) {
    var evt = new CustomEvent("spotifyRemoteIFrame.playModeChanged", {detail: JSON.stringify(event)});
    document.dispatchEvent(evt);
  });

  document.addEventListener('spotifyRemoteIFrame.pause', function () {
    window.SPR.pause();
  });

  document.addEventListener('spotifyRemoteIFrame.play', function (event) {
    window.SPR.playSpotifyURI(event.detail);
  });

  var evt = new CustomEvent("spotifyRemoteIFrame.ready");
  document.dispatchEvent(evt);
}());
