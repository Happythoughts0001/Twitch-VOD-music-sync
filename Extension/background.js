var generateRandomString = function (length) {
    var text = "";
    var possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const signInThing = () => {
    var state = generateRandomString(16);

    const params = new URLSearchParams({
        client_id:
            "996847469157-6vc74nlrgn2fhv9b2273stm8cphf66ds.apps.googleusercontent.com",
        response_type: "token",
        scope: "https://www.googleapis.com/auth/youtube.readonly",
        redirect_uri: chrome.identity.getRedirectURL(),
        state: state,
    });

    const request = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    chrome.identity.launchWebAuthFlow(
        { url: request, interactive: true },
        (response) => {
            const responseObj = new URLSearchParams(
                new URL(response).hash.substring(1)
            );

            const token = responseObj.get("access_token");
            const state = responseObj.get("state");
            chrome.storage.local.set({ youtube_access_token: token });
            console.log("token: ", token, "state: ", state);
        }
    );
};
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

chrome.runtime.onMessage.addListener(function (request, sender) {
    console.log(
        sender.tab
            ? "from a content script:" + sender.tab.url
            : "from the extension"
    );
    if (request.greeting === "hello") {
        signInThing();
    }
});

chrome.runtime.onConnect.addListener(function (port) {
    console.assert(port.name === "token");
    port.onMessage.addListener(async function (msg) {
        if (msg.token === "Give me now") {
            port.postMessage({
                answer: "Here you go",
                token: await getTokenFromStorage(),
            });
        }
    });
});
