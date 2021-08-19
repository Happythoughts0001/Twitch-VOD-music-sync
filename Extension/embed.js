const script = document.createElement("script");
script.src = chrome.runtime.getURL("youtube_api.js");
document.head.appendChild(script);
chrome.runtime.onMessage.addListener(function (request, sender) {
    if (request.greeting === "Embed Video") {
        window.postMessage({ type: "FROM_PAGE", text: request.youtubeID });
    }
});
