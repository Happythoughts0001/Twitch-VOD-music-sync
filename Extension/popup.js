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
