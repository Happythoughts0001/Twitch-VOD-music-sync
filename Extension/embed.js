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
            song: latestSong.name,
            artist: latestSong.artist["#text"],
        });
    }
});

let fileObject = "";
let start = "";
let songs = "";
let currentSong = {
    name: null,
    artist: {
        "#text": null,
    },
};

function getLatestSong(time, start) {
    return songs
        .filter((song) => !song["@attr"]?.nowplaying)
        .find((song) => Number(song.date.uts) <= start + time);
}

async function test() {
    const lastFMUsername = "happythoughts01";
    let secretData = await fetch(
        chrome.runtime.getURL("secretThings.json")
    ).then((response) => response.json());

    let vodID = document.location.pathname
        .substring("/videos/".length)
        .split("/")[0];

    const specialVOD = await fetch(
        `https://api.twitch.tv/kraken/videos/${vodID}`,
        {
            headers: {
                "Client-ID": `${secretData.twitchAPI}`,
                Accept: "application/vnd.twitchtv.v5+json",
            },
        }
    ).then((response) => response.json());

    start = Date.parse(specialVOD.created_at) / 1000;
    let end = specialVOD.length + start;

    songs = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastFMUsername}&api_key=${secretData.lastFMAPI}&format=json&from=${start}&to=${end}`
    ).then((response) => response.json());

    songs = songs.recenttracks.track;
    getTime();
}

async function getPlayerTime() {
    if (songs) {
        const newSong = await getTime();
        if (
            newSong &&
            (currentSong.name !== newSong.name ||
                currentSong.artist["#text"] !== newSong.artist["#text"])
        ) {
            // New song started playing
            console.log("New song", newSong.name);
            chrome.runtime.sendMessage({
                request: "send",
                song: newSong.name,
                artist: newSong.artist["#text"],
            });
        }
        if (newSong) {
            currentSong = newSong;
        }
    }
}

setInterval(getPlayerTime, 5000);

async function getTime() {
    let timerElement = document.querySelector(
        '.video-player[data-a-player-type="site"] video'
    );
    let time = timerElement.currentTime;
    latestSong = getLatestSong(time, start);
    return latestSong;
}

test();
