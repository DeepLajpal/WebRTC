var rtpAudioSenders = []; // Array to store RTP audio senders
var rtpVideoSenders = []; // Array to store RTP video senders
var socketUrl = "http://localhost:3000"; // Socket URL
var localUserVideo; // Local user video element
var username = globalState.name;
var meeting_id = globalState.meetingId;
var remoteVideoStream = []; // Array to store remote video streams
var remoteAudioStream = []; // Array to store remote audio streams
var audioTrack; // Local audio track
var mediaTrack; // Local media track
var users_connectionID = []; // Array to store user connection IDs
var users_connection = []; // Array to store user connections

// Function to send SDP message to signaling server
var sdpFunction = (data, to_connid) => {
    socket.emit("sdpProcess", {
        message: data,
        to_connid: to_connid,
    });
};

var socket = io.connect(socketUrl); // Connect to socket server
console.log(`socket established`);

socket.on("connect", () => {
    if (socket.connected) {
        // Send user info to signaling server
        socket.emit("users_info_to_signaling_server", {
            current_user_name: username,
            meeting_id: meeting_id,
        });
    }

    var localConnectionID = socket.id; // Get local connection ID
    localUserVideo = document.getElementById("localStream"); // Get local user video element
    processMedia(); // Process media devices
});

socket.on("new_user_to_inform_about_currentMeetingUsers", function (currentMeetingUsers) {
    $("#remote-video .other").remove();

    for (let i = 0; i < currentMeetingUsers.length; i++) {
        addUser(currentMeetingUsers[i].user_id, currentMeetingUsers[i].connectionId); // Adding other users to the UI of a new user
        createConnection(currentMeetingUsers[i].connectionId); // Create connection with other users
    }
});

socket.on("currentMeetingUsers_to_inform_about_new_connection_information", function (data) {
    addUser(data.newUserId, data.newUserConnId); // Adding new users to other users UI
    createConnection(data.newUserConnId); // other user making connection with the new user
});

// Function to add user to the UI
function addUser(other_username, connId) {
    $("#remote-video").append(`
          <div id="${connId}" class="remote-user other div-center-column">
              <h5 class="div-center">${other_username}</h5>
              <div class="div-center">
                  <video autoplay id="video_${connId}"></video>
                  <audio autoplay id="audio_${connId}"></audio>
              </div>
          </div>
      `);
}

// Function to update media senders
function updateMediaSenders(track, rtpSenders) {
    for (var con_id in users_connection) {
        var connection = users_connection[con_id];
        if (
            connection &&
            (connection.connectionState == "new" ||
                connection.connectionState == "connecting" ||
                connection.connectionState == "connected")
        ) {
            if (rtpSenders[con_id] && rtpSenders[con_id].track) {
                rtpSenders[con_id].replaceTrack(track);
            } else {
                rtpSenders[con_id] = users_connection[con_id].addTrack(track);
            }
        }
    }
}

var iceConfig = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302",
        },
        {
            urls: "stun:stun1.l.google.com:19302",
        },
        {
            urls: "stun:stun2.l.google.com:19302",
        },
        {
            urls: "stun:stun3.l.google.com:19302",
        },
        {
            urls: "stun:stun4.l.google.com:19302",
        },
    ],
};

// Function to create a new connection
async function createConnection(connId) {
    var connection = new RTCPeerConnection(iceConfig);

    connection.onicecandidate = function (event) {
        if (event.candidate) {
            console.log('event.candidate:', event.candidate)
            sdpFunction(
                JSON.stringify({
                    iceCandidate: event.candidate,
                }),
                connId
            );
        }else{
            console.log('ice gathering is completed')
        }
    }

    connection.onnegotiationneeded = async function (event) {
        await createOffer(connId);
    };

    connection.ontrack = function (event) {
        if (!remoteVideoStream[connId]) {
            remoteVideoStream[connId] = new MediaStream();
        }

        if (event.track.kind == "video") {
            remoteVideoStream[connId]
                .getTracks()
                .forEach((t) => remoteVideoStream[connId].removeTrack(t));
            remoteVideoStream[connId].addTrack(event.track);
            var remoteVideoDiv = document.getElementById("video_" + connId);
            remoteVideoDiv.srcObject = null;
            remoteVideoDiv.srcObject = remoteVideoStream[connId];
            remoteVideoDiv.load();
        } else if (event.track.kind == "audio") {
            remoteAudioStream[connId]
                .getTracks()
                .forEach((t) => remoteAudioStream[connId].removeTrack(t));
            remoteAudioStream[connId].addTrack(event.track);
            var remoteAudioDiv = document.getElementById("audio_" + connId);
            remoteAudioDiv.srcObject = null;
            remoteAudioDiv.srcObject = remoteAudioStream[connId];
            remoteAudioDiv.load();
        }
    };
    users_connectionID[connId] = connId;
    users_connection[connId] = connection;
    updateMediaSenders(mediaTrack, rtpVideoSenders);
    return connection;
}

// Function to create offer
async function createOffer(connid) {
    var connection = users_connection[connid];
    var offer = await connection.createOffer();

    await connection.setLocalDescription(offer);

    sdpFunction(
        JSON.stringify({
            offer: connection.localDescription,
        }),
        connid
    );
}

socket.on("sdpProcess", async function (data) {
    await sdpProcess(data.message, data.from_connid);
});

// Function to process media devices
async function processMedia() {
    try {
        var vStream = null;
        var aStream = null;

        vStream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: 720,
                height: 480,
            },

            audio: false,
        });
        aStream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
        });

        audioTrack = aStream.getAudioTracks()[0];
        audioTrack.enable = true;
        updateMediaSenders(audioTrack, rtpAudioSenders);

        mediaTrack = vStream.getVideoTracks()[0];
        localUserVideo.srcObject = new MediaStream([mediaTrack]);
        updateMediaSenders(mediaTrack, rtpVideoSenders);
    } catch (err) {
        console.log("error on process media: ", err);
    }
}

// Function to process SDP message
async function sdpProcess(message, from_connid) {
    message = JSON.parse(message);

    if (message.answer) {
        await users_connection[from_connid].setRemoteDescription(
            new RTCSessionDescription(message.answer)
        );
    } else if (message.offer) {
        if (!users_connection[from_connid]) {
            console.log("inside not created connection if block")
            await createConnection(from_connid);
        }

        await users_connection[from_connid].setRemoteDescription(
            new RTCSessionDescription(message.offer)
        );
        var answer = await users_connection[from_connid].createAnswer();

        await users_connection[from_connid].setLocalDescription(answer);
        sdpFunction(
            JSON.stringify({
                answer: answer,
            }),
            from_connid
        );
    } else if (message.iceCandidate) {
        if (!users_connection[from_connid]) {
            await createConnection(from_connid);
        }
        try {
                await users_connection[from_connid].addIceCandidate(
                    message.iceCandidate
                );
        } catch (error) {
            console.log("error inside the sdp process message.iceCandidate: ", error);
        }
    }
}

socket.on('closedConnectionInfo', function(connId){
    $('#'+connId).remove();
    users_connectionID[connId] = null;
    users_connection[connId] = close();
    users_connection[connId]= null;
    if (remoteVideoStream[connId]){
        remoteVideoStream[connId].getTracks().forEach(t => {
            t.stop();
        });
        remoteVideoStream[connId] = null;
    }
})