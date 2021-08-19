fetch(chrome.runtime.getURL("song.json"))
    .then((response) => response.json())
    .then((json) => {
        getTime(json);
    });

function getLatestSong(arrayOfSongs, time) {
    return [...arrayOfSongs].reverse().find((song) => song.timestamp <= time);
}

function getTime(fileObject) {
    let twitchID = document.location.pathname.split("/").slice(-1)[0];
    if (fileObject[twitchID]) {
        let proofcheck = 0;
        let intervalVariable = setInterval(() => {
            let timerElement = document.querySelector(
                '.video-player[data-a-player-type="site"] video'
            );
            let time = timerElement.currentTime * 1000;
            let latestSong = getLatestSong(fileObject[twitchID], time);
            if (timerElement == null) {
                proofcheck = 1;
                clearInterval(intervalVariable);
                let refreshInterval = setInterval(() => {
                    if ((proofcheck = 0)) {
                        clearInterval(refreshInterval);
                    }
                    getTime(fileObject);
                }, 10000);
            }
        }, 1000);
    }
}

function justLogSomething() {
    chrome.runtime.sendMessage({ greeting: "hello" });
}

function getTokenFromStorage() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get("youtube_access_token", (items) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError.message);
            }
            return resolve(items.youtube_access_token);
        });
    });
}

async function youtubeSearch() {
    let token = await getTokenFromStorage();
    let query = "HappyThoughts";

    console.log(token);

    const params = new URLSearchParams({
        part: "snippet",
        maxResults: "1",
        order: "relevance",
        q: query,
        type: "video",
        // videoEmbeddable: "true",
    });
    const request = `https://www.googleapis.com/youtube/v3/search?${params.toString()}`;
    const response = await fetch(request, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    }).then((response) => response.json());

    console.log("response", response);
    return response.items[0].id.videoId;
}

let loginButton = document.getElementById("loginButton");
let timeButton = document.getElementById("timeButton");

loginButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: justLogSomething,
    });
});

timeButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let youtubeID = await youtubeSearch();

    chrome.tabs.sendMessage(tab.id, { greeting: "Embed Video", youtubeID });
});
