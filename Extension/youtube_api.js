let temp = document.createElement("div");
temp.id = "player";
document.body.appendChild(temp);
// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
window.onYouTubeIframeAPIReady = () => {
    player = new YT.Player("player", {
        height: "390",
        width: "640",
        playerVars: {
            playsinline: 1,
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
        },
    });
    player.setVolume(20);
};

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 6000);
        done = true;
    }
}
function stopVideo() {
    player.stopVideo();
}

var port = chrome.runtime.connect();

window.addEventListener(
    "message",
    (event) => {
        // We only accept messages from ourselves
        if (event.source != window) {
            return;
        }

        if (event.data.type && event.data.type == "FROM_PAGE") {
            console.log("Content script received: " + event.data.text);
            port.postMessage(event.data.text);
            player.loadVideoById(event.data.youtubeID);
        }
    },
    false
);
