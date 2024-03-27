import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useGlobalState } from './ContextAPI/GlobalStateContext';
import MultiUsersCard from './Components/Video Meet/getMultiUsersCard';

function SocketConfig() {
    const { globalState, updateGlobalState } = useGlobalState();
    const socketRef = useRef(null);
    var rtpAudioSenders = []; // Array to store RTP audio senders
    var rtpVideoSenders = []; // Array to store RTP video senders
    var remoteVideoStream = []; // Array to store remote video streams
    var remoteAudioStream = []; // Array to store remote audio streams
    var audioTrack; // Local audio track
    var mediaTrack; // Local media track
    var users_connectionID = []; // Array to store user connection IDs
    var users_connection = []; // Array to store user connections


    var sdpFunction = (data, to_connid) => {
        socket.emit("sdpProcess", {
            message: data,
            to_connid: to_connid,
        });
    };

    useEffect(() => {
        const socketUrl = "http://localhost:4001";
        const username = globalState.name;
        const meeting_id = globalState.meetingId;

        const socket = io.connect(socketUrl);
        socketRef.current = socket;

        socket.on("connect", () => {
            if (socket.connected) {
                socket.emit("users_info_to_signaling_server", {
                    current_user_name: username,
                    meeting_id: meeting_id,
                });
            }
            processMedia();
        });

        socket.on("new_user_to_inform_about_currentMeetingUsers", function (currentMeetingUsers) {
            // Update UI with current meeting users
            for (let i = 0; i < currentMeetingUsers.length; i++) {
                console.log({ remoteUsers: [...globalState.remoteUsers, { UserName: currentMeetingUsers[i].user_id, ConnId: data.currentMeetingUsers[i].connectionId }] }, 'updateGlobalState')
                updateGlobalState({ remoteUsers: [...globalState.remoteUsers, { UserName: currentMeetingUsers[i].user_id, ConnId: data.currentMeetingUsers[i].connectionId }] })
                createConnection(currentMeetingUsers[i].connectionId); // Create connection with other users
            }
        });

        socket.on("currentMeetingUsers_to_inform_about_new_connection_information", function (data) {
            // updateGlobalState({ remoteUsers: [...globalState.remoteUsers, { UserName: data.newUserId, ConnId: data.newUserConnId }] })
            createConnection(data.newUserConnId); // other user making connection with the new user
        });

        // socket.on("sdpProcess", async function (data) {
        //     await sdpProcess(data.message, data.from_connid);
        // });

        socket.on('closedConnectionInfo', function (connId) {
            users_connectionID[connId] = null;
            users_connection[connId] = close();
            users_connection[connId] = null;
            if (remoteVideoStream[connId]) {
                remoteVideoStream[connId].getTracks().forEach(t => {
                    t.stop();
                });
                remoteVideoStream[connId] = null;
            }
        });

        return () => {
            // Clean up socket connection
            // socket.disconnect();
        };
    }, [globalState]);


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

        socket.on("sdpProcess", async function (data) {
            await sdpProcess(data.message, data.from_connid);
        });
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
            } else {
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

            // if (event.track.kind == "video") {
            //     remoteVideoStream[connId]
            //         .getTracks()
            //         .forEach((t) => remoteVideoStream[connId].removeTrack(t));
            //     remoteVideoStream[connId].addTrack(event.track);
            //     var remoteVideoDiv = document.getElementById("video_" + connId);
            //     remoteVideoDiv.srcObject = null;
            //     remoteVideoDiv.srcObject = remoteVideoStream[connId];
            //     remoteVideoDiv.load();
            // }
            // else if (event.track.kind == "audio") {
            //     remoteAudioStream[connId]
            //         .getTracks()
            //         .forEach((t) => remoteAudioStream[connId].removeTrack(t));
            //     remoteAudioStream[connId].addTrack(event.track);
            //     var remoteAudioDiv = document.getElementById("audio_" + connId);
            //     remoteAudioDiv.srcObject = null;
            //     remoteAudioDiv.srcObject = remoteAudioStream[connId];
            //     remoteAudioDiv.load();
            // }
        };
        // users_connectionID[connId] = connId;
        // users_connection[connId] = connection;
        // updateMediaSenders(mediaTrack, rtpVideoSenders);
        return connection;
    }

    async function processMedia() {
        try {
            const vStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: 720,
                    height: 480,
                },
                audio: false,
            });
            // const aStream = await navigator.mediaDevices.getUserMedia({
            //     video: false,
            //     audio: true,
            // });

            // const audioTrack = aStream.getAudioTracks()[0];
            // audioTrack.enable = true;

            const mediaTrack = vStream.getVideoTracks()[0];
            // globalState.localVideoRef.current.srcObject = new MediaStream([mediaTrack]);
        } catch (err) {
            console.log("error on process media: ", err);
        }
    }


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

    return null
}

export default SocketConfig;
