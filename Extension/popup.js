fetch(chrome.runtime.getURL("song.json"))
    .then((response) => response.json())
    .then((json) => getTime(json));

function getTime(fileObject) {
    fileObject.forEach((twitchID) => {
        if (
            twitchID.ID === document.location.pathname.split("/").slice(-1)[0]
        ) {
            let proofcheck = 0;
            let intervalVariable = setInterval(() => {
                let timerElement = document.querySelector(
                    '[data-a-target="player-seekbar-current-time"]'
                );
                console.log(timerElement);
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
    });
}

/* 
⍻   User downloads the extension.
✅  Then user clicks extension
⍻   This will promt them to the oauth2 website to login :)
⍻   Then they will proceed to the designated VOD and get the information from the server
⍻   The extension will then play the songs it is told from the server at the appointed times pog pog pog pog

Use local storage / cookies :happythoSmile:

*/
function justLogSomething() {
    chrome.runtime.sendMessage({ greeting: "hello" });
}

let loginButton = document.getElementById("loginButton");

loginButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: justLogSomething,
    });
});
