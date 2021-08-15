var secrets = require("./secretThings.json");
var secrets = require("./spotify-player.js");

var client_id = secrets.clientID; // Your client id
var client_secret = secrets.clientSecret; // Your secret

// your application requests authorization
var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
        Authorization:
            "Basic " +
            new Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    form: {
        grant_type: "client_credentials",
    },
    json: true,
};

// Called when the Spotify Web Playback SDK is ready to use
function spotifyReady() {
    window.onSpotifyWebPlaybackSDKReady = () => {
        // Define the Spotify Connect device, getOAuthToken has an actual token
        // hardcoded for the sake of simplicity
        var player = new Spotify.Player({
            name: "A Spotify Web SDK Player",
            getOAuthToken: (callback) => {
                callback(authOptions);
            },
            volume: 0.1,
        });

        // Called when connected to the player created beforehand successfully
        player.addListener("ready", ({ device_id }) => {
            console.log("Ready with Device ID", device_id);
            player.id = device_id;

            const play = ({
                spotify_uri,
                playerInstance: {
                    _options: { getOAuthToken, id },
                },
            }) => {
                getOAuthToken((access_token) => {
                    fetch(
                        `https://api.spotify.com/v1/me/player/play?device_id=${player.id}`,
                        {
                            method: "PUT",
                            body: JSON.stringify({ uris: [spotify_uri] }),
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${access_token}`,
                            },
                        }
                    );
                });
            };

            let track = "uppercut";

            fetch(`https://api.spotify.com/v1/search?q=${track}&type=track`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${secrets.access_token}`,
                },
            }).then((response) => {
                console.log(response);
            });

            /* play({
                        playerInstance: player,
                        spotify_uri: 'spotify:track:7kW8KlDA7A2Fie3IY299FX',
                    }); */
        });
        // Connect to the player created beforehand, this is equivalent to
        // creating a new device which will be visible for Spotify Connect
        player.connect();
    };
    spotifyReady();
}
