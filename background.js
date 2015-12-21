chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    details.requestHeaders.push({
      name: "Referer",
      value: "https://embed.spotify.com/?uri=spotify:track:4bz7uB4edifWKJXSDxwHcs"
    }, {
      name: "Origin",
      value: "https://embed.spotify.com"
    });
    return {requestHeaders: details.requestHeaders};
  },
  {urls: ["*://*.spotilocal.com/*"]},
  ["blocking", "requestHeaders"]
);

var SPOTIFY_PORT_START = 4370;
var SPOTIFY_PORT_END = 4381;
var MAX_RETRY_COUNT = 3;

var csrf;
var oauth;
var spotifyLocalPort;
var spotifyRemote = $.Deferred();

function getSpotifyLocalSubdomain() {
  var subdomain = "";
  for (var i = 0; i < 10; i++) {
    subdomain += String.fromCharCode(Math.floor((Math.random() * 26 + 97)));
  }
  return subdomain
}

function getCSRF() {
  var csrfDeferred = $.Deferred();
  getCSRFInternal(SPOTIFY_PORT_START, 0, csrfDeferred);
  return csrfDeferred.promise();
}

function getCSRFInternal(port, retryCount, csrfDeferred) {
  $.ajax("https://" + getSpotifyLocalSubdomain() + ".spotilocal.com:" + port + "/simplecsrf/token.json", {cache: false})
    .success(function (res) {
      csrf = res.token;
      spotifyLocalPort = port;
      csrfDeferred.resolve();
    })
    .fail(function () {
      if (retryCount === MAX_RETRY_COUNT) {
        port = port + 1;
        retryCount = 0;
      } else {
        retryCount = retryCount + 1;
      }
      if (port < SPOTIFY_PORT_END) {
        getCSRFInternal(port, retryCount, csrfDeferred)
      }
    });
}

function getOAuth() {
  return $.ajax("https://open.spotify.com/token", {cache: false, data: {'_': Date.now()}})
    .success(function (res) {
      oauth = res.t;
    });
}

function handShake() {
  return $.when(getCSRF(), getOAuth()).then(function () {
    spotifyRemote.resolve();
  });
}
handShake();

chrome.alarms.create("handshake", {periodInMinutes: 60});
chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === "handshake") {
    handShake();
  }
});

chrome.runtime.onMessage.addListener(function (request, sender) {
  if (request.type === 'handshake') {
    handShake().then(function() {
      chrome.tabs.sendMessage(sender.tab.id, request)
    });
  } else {
    spotifyRemote.then(function () {
      if (request.type === 'play') {
        $.ajax("https://" + getSpotifyLocalSubdomain() + ".spotilocal.com:" + spotifyLocalPort + "/remote/play.json", {
          cache: false,
          data: {
            csrf: csrf,
            oauth: oauth,
            uri: request.song
          }
        });
      } else if (request.type === 'pause') {
        $.ajax("https://" + getSpotifyLocalSubdomain() + ".spotilocal.com:" + spotifyLocalPort + "/remote/pause.json", {
          cache: false,
          data: {
            csrf: csrf,
            oauth: oauth,
            pause: true
          }
        });
      }
    });
  }
});
