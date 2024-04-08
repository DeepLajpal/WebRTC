import { useCallback, useEffect, useState } from 'react';
import { useGlobalState } from '../ContextAPI/GlobalStateContext';
import initSocket from './socketConnection.jsx';


const InitializeSocket = () => {
    const [users_connection, setUsersConnection] = useState([]); // Array to store user connections
    const [socketState, setSocketState] = useState(null);
    // var remoteVideoStream = []; // Array to store remote video streams

    const [existingUsersData, setExistingUsersData] = useState([]);
    const { globalState } = useGlobalState();


    function updateMediaSenders(track) {
        console.log('updateMediaSenders called')
        if(users_connection.length === 0) return;
        for (var con_id in users_connection) {
            var connection = users_connection[con_id];
            if (
                connection &&
                (connection.connectionState == "new" ||
                    connection.connectionState == "connecting" ||
                    connection.connectionState == "connected")
            ) {
                console.log('inside the if block of updateMediaSenders function')
                if (connection[con_id] && connection[con_id].track) {
                    connection[con_id].replaceTrack(track);
                } else {
                    users_connection[con_id].addTrack(track);
                }
            }
        }
    }

    const sdpFunction = useCallback((data, to_connid, whoIsCalling) => {
        console.log('sdpFunction called', whoIsCalling)
        if(socketState){
            socketState.emit("sdpProcess", {
                message: data,
                to_connid: to_connid,
            });
        }else{
            console.log('socket not connected', socketState)
        }
    }, [socketState]);

    const createOffer = useCallback(async (connid, connection) => {
        try {
            if (!connection.localDescription && connection.signalingState !== 'have-remote-offer') {
                var offer = await connection.createOffer();
                await connection.setLocalDescription(offer);
                console.log('local description, offer created: ', connection.localDescription)
            } else {
                console.log('local description already exists, which is remote offer ')
            }
        } catch (error) {
            console.log("error inside the create offer: ", error);
        }

        sdpFunction(
            JSON.stringify({
                offer: connection.localDescription,
            }),
            connid,
            'createOffer'
        );
    }, [users_connection, sdpFunction]);

    const handleIceCandidate = useCallback((event, connId) => {
        if (event.candidate) {
            sdpFunction(
                JSON.stringify({
                    iceCandidate: event.candidate,
                }),
                connId,
                'iceCandidate'
            );
        } else {
            console.log('ice gathering is completed')
        }
    }, [sdpFunction]);

    
    const createConnection = useCallback((connId, isRequestComingFromNewUser) => {
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
        var connection = new RTCPeerConnection(iceConfig);

        connection.createDataChannel("channel");

        connection.onicecandidate = () => handleIceCandidate(event, connId);

        connection.onnegotiationneeded = async function () {
            if (isRequestComingFromNewUser === "false") {
                await createOffer(connId, connection);
            } else {
                console.log('waiting for offer to be created by the other user')
            }
        };

        connection.ontrack = function (event) {
            console.log('ontrack event: ', event)
            // if (!remoteVideoStream[connId]) {
            //   remoteVideoStream[connId] = new MediaStream();
            // }

            // if (event.track.kind == "video") {
            //   remoteVideoStream[connId]
            //     .getTracks()
            //     .forEach((t) => remoteVideoStream[connId].removeTrack(t));
            //   remoteVideoStream[connId].addTrack(event.track);
            // //   var remoteVideoDiv = remoteVideosRef.current[connId];
            // //   remoteVideoDiv.srcObject = null;
            // //   remoteVideoDiv.srcObject = remoteVideoStream[connId];
            // //   remoteVideoDiv.load();
            // }
        };

        setUsersConnection((prevConnections) => {
            const newConnections = [...prevConnections];
            newConnections[connId] = connection;
            return newConnections;
        });

        //   try {
        //     updateMediaSenders(mediaStream);
        //   } catch (error) {
        //     console.log('Media track not available');
        //   }
        return connection;
    }, [createOffer, handleIceCandidate]);

    const sdpProcess = useCallback(async (message, from_connid) => {
        message = JSON.parse(message);

        if (message.answer) {
            try {
                if
                    (!users_connection[from_connid].remoteDescription) {

                    await users_connection[from_connid].setRemoteDescription(
                        new RTCSessionDescription(message.answer)
                    );
                    console.log('RemoteDescription, answer received', message.answer)

                }
            } catch (error) {
                console.log("error inside the sdp process message.answer: ", error);
            }
        } else if (message.offer) {

            if (!users_connection[from_connid]) {
                createConnection(from_connid);
            }

            try {
                if (!users_connection[from_connid].remoteDescription && users_connection[from_connid].signalingState !== 'have-local-offer') {
                    await users_connection[from_connid].setRemoteDescription(
                        new RTCSessionDescription(message.offer)
                    );
                    console.log('RemoteDescription, offer received', message.offer)
                }
            } catch (error) {
                console.log("error inside the sdp process message.offer: ", error);
            }

            try {
                if (
                    users_connection[from_connid].signalingState === "have-remote-offer"
                ) {
                    var answer = await users_connection[from_connid].createAnswer();
                    await users_connection[from_connid].setLocalDescription(answer);
                    console.log('local description, answer created: ', users_connection[from_connid].localDescription)
                    sdpFunction(
                        JSON.stringify({
                            answer: answer,
                        }),
                        from_connid,
                        'createAnswer'
                    );
                }

            } catch (error) {
                console.log("error inside the sdp process message.offer: ", error);
            }
        } else if (message.iceCandidate) {
            if (!users_connection[from_connid]) {
                createConnection(from_connid);
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
    }, [createConnection, sdpFunction, users_connection]);

    const handleSdpProcess = useCallback(async (data) => {
        await sdpProcess(data.message, data.from_connid);
    }, [sdpProcess]);

    const handleClosedConnectionInfo = useCallback((closedConnectionID) => {
        if (users_connection[closedConnectionID]) {
            users_connection[closedConnectionID].close();
        }

        // if (remoteVideoStream[closedConnectionID]) {
        //   remoteVideoStream[closedConnectionID].getTracks().forEach(t => {
        //     t.stop();
        //   });
        //   remoteVideoStream[closedConnectionID] = null;
        // }

        setExistingUsersData(prevUsers => prevUsers.filter(user => user.connectionId !== closedConnectionID));
    }, [users_connection]);


    const informNewUserAboutAllCurrentUsers = useCallback((currentMeetingUsers) => {
        for (let i = 0; i < currentMeetingUsers.length; i++) {
            try {
                console.log(socketState, 'informNewUserAboutAllCurrentUsers Socket State')
                setExistingUsersData(prevUsers => [...prevUsers, currentMeetingUsers[i]]);
                createConnection(currentMeetingUsers[i].connectionId, "true");
                // updateMediaSenders(mediaStream);
            } catch (error) {
                console.log('error inside new_user_to_inform_about_currentMeetingUsers: ', error)
            }
        }
    }, [])

    const informCurrentUsersAboutNewUserInfo = useCallback((newUser) => {
        try {
            console.log(socketState, 'informCurrentUsersAboutNewUserInfo Socket State')
            setExistingUsersData(prevUsers => [...prevUsers, newUser]);
            createConnection(newUser.connectionId, "false");
            // updateMediaSenders(mediaStream);
        } catch (error) {
            console.log('error inside currentMeetingUsers_to_inform_about_new_connection_information: ', error)
        }
    }, []);

    const closeAllConnections = useCallback(() => {
        for (var con_id in users_connection) {
            var connection = users_connection[con_id];
            if (connection) {
                connection.close();
                setUsersConnection((prevConnections) => {
                    const newConnections = [...prevConnections];
                    newConnections[con_id] = null;
                    return newConnections;
                });
                connection = null;
            }
        }
        setExistingUsersData([]);
    }, [users_connection]);

    // useEffect(() => {
    //     console.log('mediaStream:', mediaStream);
    //     if (users_connection.length > 0) {
    //         // updateMediaSenders(mediaStream);
    //     }
    //     console.log('mediaStream updated');
    // }, [mediaStream])

    const connectToSocket = useCallback(async () => {
        const socket = await initSocket();
        setSocketState(() => {
            console.log('socketState:', socket)
            return socket
        });
    }, [])

    useEffect(() => {
        connectToSocket()
        return () => {
            if (socketState) {
                socketState.disconnect();
                setSocketState(null);
            }
            console.log('socket clenup done');
            closeAllConnections();
        }
    }, [])

    // useEffect(() => {
    //     if(socketState){
    //         // Send user info to signaling server
    //         socketState.emit("users_info_to_signaling_server", {
    //             current_user_name: globalState?.name, 
    //             meeting_id: globalState?.meetingId,
    //         });
    //         socketState.on("currentMeetingUsers_to_inform_about_new_connection_information", informCurrentUsersAboutNewUserInfo);
    
    //         socketState.on("new_user_to_inform_about_currentMeetingUsers", informNewUserAboutAllCurrentUsers);
    
    //         socketState.on('closedConnectionInfo', (closedConnectionID) => {
    //             handleClosedConnectionInfo(closedConnectionID)
    //             setUsersConnection((prevConnections) => {
    //                 const newConnections = [...prevConnections];
    //                 newConnections[closedConnectionID] = null;
    //                 return newConnections;
    //             });
    //         });
    
    //         socketState.on("sdpProcess", handleSdpProcess);
    
    //         socketState.on('disconnect', () => {
    //             console.log('Disconnected from socket');
    //         });
    
    //         socketState.on('connect_error', (error) => {
    //             console.error('Error connecting to socket:', error);
    //         });
    //     }

    // }, [socketState])

    useEffect(() => {
        if (socketState) {
            console.log(socketState, 'socketState')
            socketState.emit("test", "test message to server");
            socketState.on("test", (data) => {
                console.log('test message from server:', data);
            });
        }
    }, [socketState])

    useEffect(() => {
        console.log("existingUsersData:", existingUsersData);
    }, [existingUsersData]);
    return null;
}

export default InitializeSocket;