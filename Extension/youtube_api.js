let temp = document.createElement("div");
let controls = document.createElement("div");

// Creates the iframe player
temp.id = "player";
document.body.appendChild(temp);

// Creates a control panel for the embedded iframe
controls.id = "controls";
controls.innerHTML = `<div style="background-color: grey; position: fixed; padding: .5rem; top: 20px; z-index: 9999">
<button onclick=playVideo()>Play</button>
<button onclick=pauseVideo()>Pause</button>
<input type="range" min="1" max="100" value="20" class="slider" id="volumeRange">
</div>`;
document.body.appendChild(controls);
let volumeSlider = document.getElementById("volumeRange");

// Extension control panel functions
volumeSlider.oninput = function () {
    player.setVolume(this.value);
};

function pauseVideo() {
    player.pauseVideo();
}

function playVideo() {
    player.playVideo();
}

// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function creates an <iframe> (and YouTube player) after the API code downloads.
var player;
window.onYouTubeIframeAPIReady = () => {
    player = new YT.Player("player", {
        height: "500",
        width: "500",
        videoId: "pulV9N8-DXs",
        playerVars: {
            playsinline: 1,
        },
        events: {
            onReady: onPlayerReady,
        },
    });
    player.setVolume(20);
};

// The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();
}

window.addEventListener(
    "message",
    (event) => {
        // We only accept messages from ourselves
        if (event.source != window) {
            return;
        }

        if (event.data.type && event.data.type == "FROM_PAGE") {
            console.log("Content script received: ");
            player.loadVideoById(event.data.youtubeID);
        }
    },
    false
);
