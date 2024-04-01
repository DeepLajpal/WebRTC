import io from 'socket.io-client';

var socket;
var users_connection = []; // Array to store user connections

const initSocket = (username, meeting_id, existingUsersData, setExistingUsersData) => {
    socket = io(import.meta.env.VITE_SOCKET_URL);
    console.log(`socket established`);

    socket.on('connect', () => {
        console.log('Connected to socket');
        if (socket.connected) {
            // Send user info to signaling server
            socket.emit("users_info_to_signaling_server", {
                current_user_name: username,
                meeting_id: meeting_id,
            });
        }

        // var localConnectionID = socket.id; // Get local connection ID
        // localUserVideo = document.getElementById("localStream"); // Get local user video element
        // processMedia(); // Process media devices

    });

    // Function to send SDP message to signaling server
    var sdpFunction = (data, to_connid) => {
        socket.emit("sdpProcess", {
            message: data,
            to_connid: to_connid,
        });
    };

    socket.on("new_user_to_inform_about_currentMeetingUsers", function (currentMeetingUsers) {
        // console.log('currentMeetingUsers: ', currentMeetingUsers)
        // $("#remote-video .other").remove();

        for (let i = 0; i < currentMeetingUsers.length; i++) {
            // addUser(currentMeetingUsers[i].user_id, currentMeetingUsers[i].connectionId); // Adding other users to the UI of a new user
            createConnection(currentMeetingUsers[i].connectionId); // Create connection with other users
        }
    });

    socket.on("currentMeetingUsers_to_inform_about_new_connection_information", function (newUser) {
        // console.log('new_connection_information: ', data)
        // addUser(data.newUserId, data.newUserConnId); // Adding new users to other users UI
        createConnection(newUser.connectionId); // other user making connection with the new user
    });

    // Function to add user to the UI
    // function addUser(other_username, connId) {
    //     $("#remote-video").append(`
    //       <div id="${connId}" class="remote-user other div-center-column">
    //           <h5 class="div-center">${other_username}</h5>
    //           <div class="div-center">
    //               <video autoplay id="video_${connId}"></video>
    //               <audio autoplay id="audio_${connId}"></audio>
    //           </div>
    //       </div>
    //   `);
    // }

    // Function to update media senders
    // function updateMediaSenders(track, rtpSenders) {
    //     for (var con_id in users_connection) {
    //         var connection = users_connection[con_id];
    //         if (
    //             connection &&
    //             (connection.connectionState == "new" ||
    //                 connection.connectionState == "connecting" ||
    //                 connection.connectionState == "connected")
    //         ) {
    //             if (rtpSenders[con_id] && rtpSenders[con_id].track) {
    //                 rtpSenders[con_id].replaceTrack(track);
    //             } else {
    //                 rtpSenders[con_id] = users_connection[con_id].addTrack(track);
    //             }
    //         }
    //     }
    // }

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
        // console.log('connection created: ', connection)

        connection.onicecandidate = function (event) {
            if (event.candidate) {
                sdpFunction(
                    JSON.stringify({
                        iceCandidate: event.candidate,
                    }),
                    connId
                );
            } else {
                console.log('ice gathering is completed')
            }
        }

        const sendChannel = connection.createDataChannel("sendChannel");
        sendChannel.onopen = e => console.log("open!!!!");
        sendChannel.onclose = e => console.log("closed!!!!!!");
        // sendChannel.onerror = error => console.error("Error on data channel:", error);

        connection.onnegotiationneeded = async function (event) {
            await createOffer(connId);
        };

        // connection.ontrack = function (event) {
        //     if (!remoteVideoStream[connId]) {
        //         remoteVideoStream[connId] = new MediaStream();
        //     }

        //     if (event.track.kind == "video") {
        //         remoteVideoStream[connId]
        //             .getTracks()
        //             .forEach((t) => remoteVideoStream[connId].removeTrack(t));
        //         remoteVideoStream[connId].addTrack(event.track);
        //         var remoteVideoDiv = document.getElementById("video_" + connId);
        //         remoteVideoDiv.srcObject = null;
        //         remoteVideoDiv.srcObject = remoteVideoStream[connId];
        //         remoteVideoDiv.load();
        //     } else if (event.track.kind == "audio") {
        //         remoteAudioStream[connId]
        //             .getTracks()
        //             .forEach((t) => remoteAudioStream[connId].removeTrack(t));
        //         remoteAudioStream[connId].addTrack(event.track);
        //         var remoteAudioDiv = document.getElementById("audio_" + connId);
        //         remoteAudioDiv.srcObject = null;
        //         remoteAudioDiv.srcObject = remoteAudioStream[connId];
        //         remoteAudioDiv.load();
        //     }
        // };

        users_connection[connId] = connection;
        // updateMediaSenders(mediaTrack, rtpVideoSenders);
        return connection;
    }

    // Function to create offer
    async function createOffer(connid) {
        var connection = users_connection[connid];
        var offer = await connection.createOffer();

        console.log('inside create offer')
        await connection.setLocalDescription(offer);
        console.log('local description, offer: ', connection.localDescription)

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
    // async function processMedia() {
    //     try {
    //         var vStream = null;
    //         var aStream = null;

    //         vStream = await navigator.mediaDevices.getUserMedia({
    //             video: {
    //                 width: 720,
    //                 height: 480,
    //             },

    //             audio: false,
    //         });
    //         aStream = await navigator.mediaDevices.getUserMedia({
    //             video: false,
    //             audio: true,
    //         });

    //         audioTrack = aStream.getAudioTracks()[0];
    //         audioTrack.enable = true;
    //         updateMediaSenders(audioTrack, rtpAudioSenders);

    //         mediaTrack = vStream.getVideoTracks()[0];
    //         localUserVideo.srcObject = new MediaStream([mediaTrack]);
    //         updateMediaSenders(mediaTrack, rtpVideoSenders);
    //     } catch (err) {
    //        // console.log("error on process media: ", err);
    //     }
    // }

    // Function to process SDP message
    async function sdpProcess(message, from_connid) {
        message = JSON.parse(message);

        if (message.answer) {
            console.log('answer received', message.answer)
            await users_connection[from_connid].setRemoteDescription(
                new RTCSessionDescription(message.answer)
            );
        } else if (message.offer) {
            console.log('offer received', message.offer)
            if (!users_connection[from_connid]) {
                await createConnection(from_connid);
            }

            // users_connection[from_connid].ondatachannel = e => {

            //     const receiveChannel = e.channel;
            //     receiveChannel.onmessage = e => console.log("messsage received!!!" + e.data)
            // }

            await users_connection[from_connid].setRemoteDescription(
                new RTCSessionDescription(message.offer)
            );
            var answer = await users_connection[from_connid].createAnswer();

            console.log('inside offer received, answer created:')
            await users_connection[from_connid].setLocalDescription(answer);
            console.log('local description, answer: ', users_connection[from_connid].localDescription)
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
                console.log(' ice candidate adding success')
                await users_connection[from_connid].addIceCandidate(
                    message.iceCandidate
                );
            } catch (error) {
                console.log("error inside the sdp process message.iceCandidate: ", error);
            }
        }
    }

    socket.on('closedConnectionInfo', function (connId) {
        // $('#'+connId).remove();
        if (users_connection[connId]) {
            users_connection[connId].close();
            users_connection[connId] = null;
        }

        // if (remoteVideoStream[connId]){
        //     remoteVideoStream[connId].getTracks().forEach(t => {
        //         t.stop();
        //     });
        //     remoteVideoStream[connId] = null;
        // }
        // console.log('closedConnectionInfo: ', connId)
    })

    socket.on('disconnect', () => {
        console.log('Disconnected from socket');
        // Additional logic or event listeners can be added here
    });

    socket.on('connect_error', (error) => {
        console.error('Error connecting to socket:', error);
    });

    return socket;
}


// export const getSocket = () => {
//     return socket;
// };

export const getSocket = () => {
    return socket;
};
export default initSocket;