// code here
const axios = require("axios");
const secretData = require("./secretThings.json");
const fs = require("fs");
const lastFMUsername = "happythoughts01";
const lastFMPollInterval = 1000;
const twitchChannelCode = "32258140"; // get this via twich API from username

const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const addSongToVOD = (VODID, data) => {
    let fileObject = JSON.parse(fs.readFileSync("song.json"));

    fileObject[VODID] = fileObject[VODID] ?? []; // Create an entry for the VOD if it does not exist
    fileObject[VODID].push(data);

    fs.writeFileSync("song.json", JSON.stringify(fileObject, null, 4));
    console.log("wrote to file");
};

const twitchID = async () => {
    const VODresponse = await axios({
        method: "get",
        headers: {
            "Client-ID": `${secretData.twitchAPI}`,
            Accept: "application/vnd.twitchtv.v5+json",
        },
        url: `https://api.twitch.tv/kraken/channels/${twitchChannelCode}/videos?sort=time`,
    });

    let latestVOD = VODresponse.data.videos.reduce((latest, video) => {
        return Date.parse(video.created_at) > Date.parse(latest.created_at)
            ? video
            : latest;
    });
    let VODID = latestVOD._id.substring(1);

    let mostRecent;
    while (true) {
        // This loop runs at the interval defined by lastFMPollInterval
        let lastFMResponse = await axios({
            method: "get",
            url: `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastFMUsername}&api_key=${secretData.lastFMAPI}&format=json`,
        });
        console.log("sent request to LastFM");

        let song = lastFMResponse.data.recenttracks.track[0];
        let StreamerTimestamp = Date.now() - Date.parse(latestVOD.created_at);

        if (song["@attr"]?.nowplaying === "true") {
            if (!mostRecent || song.name != mostRecent.name) {
                mostRecent = song;
                // New song started playing since last check
                // isPlaying prob not working
                addSongToVOD(VODID, {
                    isPlaying: true,
                    song: song.name,
                    artist: song.artist,
                    timestamp: StreamerTimestamp,
                });
            }
        } else {
            if (mostRecent) {
                mostRecent = null;
                // The streamer was playing a song the last time we checked, but not anymore.
                // They might've stopped it before it ended so we need to keep track of that.

                addSongToVOD(VODID, {
                    isPlaying: false,
                    timestamp: StreamerTimestamp,
                });
            }
        }

        await sleep(lastFMPollInterval);
    }
};

twitchID();

// code ends

/*
Gifts
    somethingHillZone x Veloe
    somethingHillZone x D3adman107
    somethingHillZone x BlackStarRiPz
    somethingHillZone x Herr_Luftbus
    somethingHillZone x plex7
    vazoh x dotdottiee
    vazoh x Baalzebuzz
    vazoh x mapshyy
    vazoh x Pix3lik
    vazoh x DmanTrevino
    grimmten10 5 months
    Shnaps1122 9 months
    Herr_Luftbus 100 Triangles
    oh_quality 11 months
    Yin_Fang 9 months
    deathhail x Wincker
    Avoidxr x MadPixie
    fsidy ORGANIX SUBSCRIPTION
    SLgeneration 3 months
    Shinya_ow 9 months
    ChipD0ug1as 7 months
    littleyoshi_ ORGANIX SUBSCRIPTION
    Retconned 5 months
    KYRI_REE 8 months
    Karagiram x FangTitan
    Karagiram x MidnightGem
    Karagiram x RubyRage33
    Karagiram x Beef_
    Karagiram x Sindurs
    limpishh 8month
    dusk137 5 months
    niallVR 3 months
    Mocah_ 3 months
    kenajmon x Mattser93
    kenajmon x sp0r1n
    kenajmon x m3thew
    Zinxira x Tac_pause
    Rath_Nova 11 months
    l86l ORGANIX SUBSCRIPTION
    E_KARD 6 months
    Pehmew 10 months
    GentlemanVex 9 months
    Rath_Nova HZRDSpooky
    Rath_Nova GuySyr
    Rath_Nova induratize
    Rath_Nova Itskay
    Rath_Nova Teumessian
    Rath_Nova iEsdeath_
    Rath_Nova Ali1331
    Rath_Nova expiredy
    Rath_Nova Kozok009
    Rath_Nova jerrydacarry
    Animatrix13 2 months
    Its_me_BUD 9 months
    redrosey1 7 months
    m3zs 4 months
    miraitre 10 months
    dreken337 2 months
    ogpommom 2 months
    Karagiram 10 months
    afk_krogenth 4 months
    grimmten10 6 months
    cruptoodude 10 months
    Zangetsu199O PATIIIIIIII
    Muriellecom 2 months
    Heads_Up 5 months
    HDSolly SergeantPleb
    lewdmop 8 months
    ItMeWindy 10 months
    Ezaah 8 months
    Dreken337 3 months
    suvyx 11 months
    fourth13 T3<3 11 months
    anonymous gofu9
    indiecah 2 months
    Wabryy 7 months
    incognito_sus 5 months
    DankableDan 10 months
    */
