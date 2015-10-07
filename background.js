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

var csrf;
var oauth;
var spotifyRemote = $.Deferred();

function getCSRF() {
  return $.ajax("https://blah.spotilocal.com:4371/simplecsrf/token.json", {cache: false})
    .success(function (res) {
      csrf = res.token;
    });
}
function getOAuth() {
  return $.ajax("https://open.spotify.com/token", {cache: false, data: {'_': Date.now()}})
    .success(function (res) {
      oauth = res.t;
    });
}

$.when(getCSRF(), getOAuth()).then(function () {
  spotifyRemote.resolve();
});

chrome.alarms.create({periodInMinutes: 60});
chrome.alarms.onAlarm.addListener(function () {
  getCSRF();
  getOAuth();
});

chrome.runtime.onMessage.addListener(function (request, sender) {
  spotifyRemote.then(function() {
    if (request.type === 'play') {
      $.ajax("https://blah.spotilocal.com:4371/remote/play.json", {
        data: {
          csrf: csrf,
          oauth: oauth,
          uri: request.song
        }
      });
    } else if (request.type === 'pause') {
      $.ajax("https://blah.spotilocal.com:4371/remote/pause.json", {
        data: {
          csrf: csrf,
          oauth: oauth,
          pause: true
        }
      });
    }
  });
});
