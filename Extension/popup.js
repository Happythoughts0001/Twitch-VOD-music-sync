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

async function youtubeSearch(song, artist) {
    let token = await getTokenFromStorage();
    let query = song + " " + artist;
    console.log("query ", query);
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
    /* const response = await fetch(chrome.runtime.getURL("response.json")).then(
        (response) => response.json()
    ); */

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

chrome.runtime.onMessage.addListener(async function (request, sender) {
    if (request.request === "send") {
        console.log("Content script received: " + request.song, request.artist);

        let youtubeID = await youtubeSearch(request.song, request.artist);

        console.log("youtubeID", youtubeID);
        chrome.tabs.sendMessage(sender.tab.id, {
            greeting: "Embed Video",
            youtubeID,
        });
    }
});

timeButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, {
        request: "getSong",
    });
});
