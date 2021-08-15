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
    var scope = "user-read-private user-read-email";

    const params = new URLSearchParams({
        client_id: "486b16a2dc7c496399995876df6d6d10",
        response_type: "code",
        scope: scope,
        redirect_uri: chrome.identity.getRedirectURL(),
        state: state,
    });
    const request = `https://accounts.spotify.com/authorize?${params.toString()}`;

    chrome.identity.launchWebAuthFlow(
        { url: request, interactive: true },
        (response) => {
            const responseObj = new URLSearchParams(
                new URL(response).search.substring(1)
            );

            const token = responseObj.get("code");
            const state = responseObj.get("state");
            console.log("token: ", token, "state: ", state);
        }
    );
};

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
