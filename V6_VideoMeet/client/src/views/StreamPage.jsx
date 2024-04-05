import React, { useEffect, useRef, useState } from 'react';
import Footer from '../Components/Video Meet/getFooter.jsx';
import styled from 'styled-components';
import initSocket from '../utility/socketConnection.jsx';
import { useGlobalState } from '../ContextAPI/GlobalStateContext';
import MultiUsersCard from '../Components/Video Meet/getMultiUsersCard.jsx';


const Stream = () => {
  var users_connection = []; // Array to store user connections
  var remoteVideoStream = []; // Array to store remote video streams
  const [mediaTrack, setMediaTrack] = useState(null);
  var socket;

  var remoteVideosRef = useRef({});

  const { globalState, updateGlobalState } = useGlobalState();
  const [existingUsersData, setExistingUsersData] = useState([]);


  function updateMediaSenders(track) {
    for (var con_id in users_connection) {
      var connection = users_connection[con_id];
      if (
        connection &&
        (connection.connectionState == "new" ||
          connection.connectionState == "connecting" ||
          connection.connectionState == "connected")
      ) {
        if (connection[con_id] && connection[con_id].track) {
          connection[con_id].replaceTrack(track);
        } else {
          users_connection[con_id].addTrack(track);
        }
      }
    }
  }




  useEffect(() => {
    socket = initSocket(globalState.name, globalState.meetingId);

    const closeAllConnections = () => {
      for (var con_id in users_connection) {
        var connection = users_connection[con_id];
        if (connection) {
          connection.close();
          users_connection[con_id] = null;
          connection = null;
        }
      }
      setExistingUsersData([]);
    }

    return () => {
      socket.disconnect();
      console.log('socket clenup done');

      closeAllConnections();
    }
  }, [])


  useEffect(() => {

    if (mediaTrack) {

      if (socket) {

        var sdpFunction = (data, to_connid) => {
          socket.emit("sdpProcess", {
            message: data,
            to_connid: to_connid,
          });
        };

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

        async function createConnection(connId, isRequestComingFromNewUser) {
          var connection = new RTCPeerConnection(iceConfig);

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

          connection.onnegotiationneeded = async function (event) {
            if (isRequestComingFromNewUser === "false") {
              await createOffer(connId, isRequestComingFromNewUser);
            } else {
              console.log('waiting for offer to be created by the other user')
            }
          };

          connection.ontrack = function (event) {
            console.log('ontrack event: ', event)
            if (!remoteVideoStream[connId]) {
              remoteVideoStream[connId] = new MediaStream();
            }

            if (event.track.kind == "video") {
              remoteVideoStream[connId]
                .getTracks()
                .forEach((t) => remoteVideoStream[connId].removeTrack(t));
              remoteVideoStream[connId].addTrack(event.track);
              var remoteVideoDiv = remoteVideosRef.current[connId];
              remoteVideoDiv.srcObject = null;
              remoteVideoDiv.srcObject = remoteVideoStream[connId];
              remoteVideoDiv.load();
            }

          };

          users_connection[connId] = connection;

          try {
            updateMediaSenders(mediaTrack);
          } catch (error) {
            console.log('Media track not available');
          }
          return connection;
        }

        async function createOffer(connid, isRequestComingFromNewUser) {
          var connection = users_connection[connid];

          console.log('inside create offer')
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
            connid
          );
        }

        async function sdpProcess(message, from_connid) {
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
              await createConnection(from_connid);
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
                  from_connid
                );
              }

            } catch (error) {
              console.log("error inside the sdp process message.offer: ", error);
            }
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

        socket.on("currentMeetingUsers_to_inform_about_new_connection_information", async function (newUser) {

          try {
            await setExistingUsersData(prevUsers => [...prevUsers, newUser]);


            await createConnection(newUser.connectionId, "false");


          } catch (error) {
            console.log('error inside currentMeetingUsers_to_inform_about_new_connection_information: ', error)
          }
        });

        socket.on("new_user_to_inform_about_currentMeetingUsers", async function (currentMeetingUsers) {
          for (let i = 0; i < currentMeetingUsers.length; i++) {
            try {
              await setExistingUsersData(prevUsers => [...prevUsers, currentMeetingUsers[i]]);

              await createConnection(currentMeetingUsers[i].connectionId, "true");

            } catch (error) {
              console.log('error inside new_user_to_inform_about_currentMeetingUsers: ', error)
            }
          }
        });

        socket.on('closedConnectionInfo', function (closedConnectionID) {
          if (users_connection[closedConnectionID]) {
            users_connection[closedConnectionID].close();
            users_connection[closedConnectionID] = null;
          }

          if (remoteVideoStream[closedConnectionID]) {
            remoteVideoStream[closedConnectionID].getTracks().forEach(t => {
              t.stop();
            });
            remoteVideoStream[closedConnectionID] = null;
          }

          setExistingUsersData(prevUsers => prevUsers.filter(user => user.connectionId !== closedConnectionID));
        })

        socket.on("sdpProcess", async function (data) {
          await sdpProcess(data.message, data.from_connid);
        });

        socket.on('disconnect', () => {
          console.log('Disconnected from socket');
        });

        socket.on('connect_error', (error) => {
          console.error('Error connecting to socket:', error);
        });
      } else {
        console.log('socket not available')
      }


    } else {
      console.log('local mediaTrack not available')
    }


    return () => {
      console.log('Unable to run this main socket function')
    }
  }, [socket, mediaTrack])

  useEffect(() => {
    console.log("existingUsersData:", existingUsersData);
  }, [existingUsersData]);


  return (
    <Wrapper>
      <MultiUsersCard
        localName={globalState.name}
        localMeetingId={globalState.meetingId}
        showVideo={globalState.Video}
        playAudio={globalState.Mic}
        existingUsersData={existingUsersData}
        updateMediaSenders={updateMediaSenders}
        remoteVideosRef={remoteVideosRef}
        setRemoteVideoRef={(connectionId, ref) => remoteVideosRef.current[connectionId] = ref}
        setMediaTrack={(track) => setMediaTrack(track)}
      />
      <Footer localMeetingId={globalState.meetingId} />
    </Wrapper>
  );
}

export default Stream;

const Wrapper = styled.div`
height:100%;
width:100%;
background:#202124;
`;
