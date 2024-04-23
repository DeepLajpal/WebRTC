import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from '@stomp/stompjs';

const SocketConfig = ({ meetingId, username})=>{
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  // const { username, meetingId } = useParams();

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);
    
    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/meeting/${meetingId}`, (message) => {
        const data = JSON.parse(message.body);
        handleSocketMessage(data);
      });

      stompClient.send(`/app/join/${meetingId}`, {}, JSON.stringify({ username }));
    });

    return () => {
      stompClient.disconnect();
    };
  }, [meetingId, username]);

  const handleSocketMessage = (data) => {
    const { type, payload } = data;
    switch (type) {
      case 'user_joined':
        addUser(payload.username, payload.connectionId);
        createConnection(payload.connectionId);
        break;
      case 'user_left':
        removeUser(payload.connectionId);
        break;
      case 'offer':
        handleOffer(payload.offer, payload.fromConnId);
        break;
      case 'answer':
        handleAnswer(payload.answer, payload.fromConnId);
        break;
      case 'ice_candidate':
        handleIceCandidate(payload.iceCandidate, payload.fromConnId);
        break;
      default:
        break;
    }
  };

  const addUser = (otherUsername, connId) => {
    setRemoteStreams((prevStreams) => ({
      ...prevStreams,
      [connId]: {
        username: otherUsername,
        videoStream: null,
        audioStream: null,
      },
    }));
  };

  const removeUser = (connId) => {
    setRemoteStreams((prevStreams) => {
      const updatedStreams = { ...prevStreams };
      delete updatedStreams[connId];
      return updatedStreams;
    });
  };

  const createConnection = (connId) => {
    // Implement RTCPeerConnection setup here
  };

  const handleOffer = (offer, fromConnId) => {
    // Handle offer and create answer
  };

  const handleAnswer = (answer, fromConnId) => {
    // Set remote description
  };

  const handleIceCandidate = (iceCandidate, fromConnId) => {
    // Handle ice candidates
  };

  // Other JSX and UI components

  return (
    <div className="main-wrap">
      Hi, I am a socket configuration component
    </div>
  );
}

export default SocketConfig;
