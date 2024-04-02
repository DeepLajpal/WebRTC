import React, { useEffect, useState } from 'react';
import Footer from '../Components/Video Meet/getFooter.jsx';
import GetVideoContainers from '../Components/Video Meet/getVideoContainers.jsx';
import styled from 'styled-components';
import initSocket from '../utility/socketConnection.jsx';
import { useGlobalState } from '../ContextAPI/GlobalStateContext';
import MultiUsersCard from '../Components/Video Meet/getMultiUsersCard.jsx';


const Stream = () => {
  var users_connection = []; // Array to store user connections
  const { globalState, updateGlobalState } = useGlobalState();
  const [existingUsersData, setExistingUsersData] = useState([]);



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


  useEffect(() => {
    let socket = initSocket(globalState.name, globalState.meetingId, existingUsersData, setExistingUsersData);

    // Function to send SDP message to signaling server
    var sdpFunction = (data, to_connid) => {
      socket.emit("sdpProcess", {
        message: data,
        to_connid: to_connid,
      });
    };

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

    socket.on("currentMeetingUsers_to_inform_about_new_connection_information", function (newUser) {
      createConnection(newUser.connectionId);
      setExistingUsersData(prevUsers => [...prevUsers, newUser]);
    });

    socket.on("new_user_to_inform_about_currentMeetingUsers", function (currentMeetingUsers) {
      for (let i = 0; i < currentMeetingUsers.length; i++) {
        createConnection(currentMeetingUsers[i].connectionId);
        setExistingUsersData(prevUsers => [...prevUsers, currentMeetingUsers[i]]);
      }
    });

    socket.on('closedConnectionInfo', function (closedConnectionID) {
      if (users_connection[closedConnectionID]) {
        users_connection[closedConnectionID].close();
        users_connection[closedConnectionID] = null;
      }
      // $('#'+connId).remove();
      // users_connectionID[connId] = null;
      // users_connection[connId] = close();
      // users_connection[connId]= null;
      // if (remoteVideoStream[connId]){
      //     remoteVideoStream[connId].getTracks().forEach(t => {
      //         t.stop();
      //     });
      //     remoteVideoStream[connId] = null;
      // }
      // console.log('closedConnectionInfo: ', connId)

      setExistingUsersData(prevUsers => prevUsers.filter(user => user.connectionId !== closedConnectionID));
    })

    socket.on("sdpProcess", async function (data) {
      await sdpProcess(data.message, data.from_connid);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket');
      // Additional logic or event listeners can be added here
    });

    socket.on('connect_error', (error) => {
      console.error('Error connecting to socket:', error);
    });

    return () => {
      socket.disconnect();
      console.log('socket clenup done');
    }
  }, [])

  useEffect(() => {
    console.log("existingUsersData:", existingUsersData);
  }, [existingUsersData]); // Log existingUsersData whenever it changes


  return (
    <Wrapper>
      <MultiUsersCard localName={globalState.name} localMeetingId={globalState.meetingId} existingUsersData={existingUsersData} />
      {/* <GetVideoContainers localName={globalState.name} localMeetingId={globalState.meetingId} existingUsersData={existingUsersData} /> */}
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
