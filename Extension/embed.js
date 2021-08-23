const script = document.createElement("script");
script.src = chrome.runtime.getURL("youtube_api.js");
document.head.appendChild(script);
chrome.runtime.onMessage.addListener(async function (request, sender) {
    if (request.greeting === "Embed Video") {
        window.postMessage({ type: "FROM_PAGE", youtubeID: request.youtubeID });
    }
    if (request.request === "getSong") {
        let latestSong = await getTime();
        console.log(latestSong);
        chrome.runtime.sendMessage({
            request: "send",
            song: latestSong.song,
            artist: latestSong.artist["#text"],
        });
    }
});

function getLatestSong(arrayOfSongs, time) {
    return [...arrayOfSongs].reverse().find((song) => song.timestamp <= time);
}

async function getTime() {
    fileObject = await fetch(chrome.runtime.getURL("song.json")).then(
        (response) => response.json()
    );

    let twitchID = document.location.pathname.split("/").slice(-1)[0];
    if (fileObject[twitchID]) {
        let timerElement = document.querySelector(
            '.video-player[data-a-player-type="site"] video'
        );
        let time = timerElement.currentTime * 1000;
        latestSong = getLatestSong(fileObject[twitchID], time);

        return latestSong;
        /* let proofcheck = 0;
        let intervalVariable = setInterval(() => {
            if (timerElement == null) {
                proofcheck = 1;
                clearInterval(intervalVariable);
                let refreshInterval = setInterval(() => {
                    if ((proofcheck = 0)) {
                        clearInterval(refreshInterval);
                    }
                    // getTime(fileObject);
                }, 10000);
            }
        }, 1000); */
    }
}
