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

async function getTokenFromStorage() {
    console.log("1");
    return new Promise((resolve, reject) => {
        console.log("2");
        chrome.storage.local.get("youtube_access_token", (items) => {
            console.log("3");
            if (runtime.lastError) {
                console.log("4");
                return reject(runtime.lastError.message);
            }
            console.log("5");
            return resolve(items.youtube_access_token);
        });
    });
}

async function youtubeSearch(token) {
    console.log("yoyo");
    let query = "sodapoppin";

    console.log("yoyoyo");
    const params = new URLSearchParams({
        part: "snippet",
        maxResults: "1",
        order: "relevance",
        q: query,
        type: "video",
        // videoEmbeddable: "true",
    });
    console.log("yoyoyo 2");
    const request = `https://www.googleapis.com/youtube/v3/search?${params.toString()}`;
    console.log("yoyoyo 3");
    const response = await fetch(request, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    }).then((response) => response.json());
    console.log("yoyoyo 4");
    console.log(response);
    return response.items && response.items[0];
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

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: youtubeSearch,
    });
});
