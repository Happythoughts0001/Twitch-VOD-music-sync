/* Spotify sync for VOD stream
    Storage of music that happened during the stream issues:
        -Store in a separate Database with timestamp and VOD ID to make it easier to find song.
        -How do we get all the songs. What happens if there's a similar song called the same thing, or if it does not exist on youtube.
    

    Limitations:
        -Do not want to store songs!
        -GDPR personal information


    Website
        -Video playing  https://dev.twitch.tv/docs/v5/reference/videos#get-video 
        -Video/audio sync

    To learn:
        How do you make a chrome extension.
        Spotify API? 
        Does youtube have a decent search function API
        Communicate with database from extension
        Login to spotify for playback


    
    {ID: "678121616", Data:
        {
            Timestamp: "01:01:01",
            Song: "Artist - Title"
        },
        {
            Timestamp: "01:03:01",
            Song: "Artist - Title"
        },
        {
            Timestamp: "01:05:01",
            Song: "Artist - Title"
        }
    },
    {ID: "132312139", Data:
        {
            Timestamp: "01:03:01",
            Song: "Artist - Title"
        }
    },

    When there is no previous saved timestamps for a VOD
    When there is a previous save timestamp for a VOD

    Create a new file for each VOD iterate through files.
    Huge file iterate through to find unique VODID


    How do we get the streamers timestamp?
    When we started -> when a new song is detected -> saved into the file
*/
// code here
const axios = require("axios");
const secretData = require("./secretThings.json");
const fs = require("fs");
const { setTimeout } = require("timers");
const lastFMUsername = "happythoughts01";
const twitchChannelCode = "32258140"; // get this via twich API from username
const twitchIDs = [
    "1074413451",
    "1073382214",
    "1072312920",
    "1071254636",
    "1070242903",
    "1069293471",
    "1067135453",
    "1066103014",
];

const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
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
    let VODID;
    let StreamerTimestamp;
    let latestVOD = VODresponse.data.videos.reduce((latest, current) => {
        if (
            !latest ||
            Date.parse(current.created_at) > Date.parse(latest.created_at)
        ) {
            latest = current;
        }
        return latest;
    });

    StreamerTimestamp = Date.now() - Date.parse(latestVOD.created_at);
    VODID = latestVOD._id.substring(1);

    lastFMresponse = await axios({
        method: "get",
        url: `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastFMUsername}&api_key=${secretData.lastFMAPI}&format=json&nowplaying="true"`,
    });

    let mostRecent = lastFMresponse.data.recenttracks.track[0].name;
    let i = 0;

    const dosomething = async () => {
        if (i % 10 == 0) {
            lastFMresponse = await axios({
                method: "get",
                url: `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastFMUsername}&api_key=${secretData.lastFMAPI}&format=json&nowplaying="true"`,
            });
            console.log("sent request to LastFM");
        }
        console.log(i++, " seconds into song");
        if (lastFMresponse.data.recenttracks.track[0].name === mostRecent) {
            await sleep(1000);
            dosomething();
        } else {
            var data = {
                song: lastFMresponse.data.recenttracks.track[0].name,
                artist: lastFMresponse.data.recenttracks.track[0].artist,
                timestamp: StreamerTimestamp,
            };

            var fileObject = JSON.parse(fs.readFileSync("song.json"));
            fileObject[VODID].push(data);

            fs.writeFileSync("song.json", JSON.stringify(fileObject, null, 4));
            mostRecent = lastFMresponse.data.recenttracks.track[0].name;
            console.log("wrote to file");
            i = 0;
            dosomething();
        }
    };
    dosomething();
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
    */
