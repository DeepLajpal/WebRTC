import React, { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import LocalUserVideoCard from "./LocalUserVideoCard";
import RemoteUserVideoCard from "./RemoteUserVideoCard";

const VideoStreams = ({ username, meeting_id, iceConfig, sendSDPMessage }) => {
  const remoteVideoStreamsRef = useRef({});
  const remoteAudioStreamsRef = useRef({});
  const [usersConnection, setUsersConnection] = useState({});
  const socketUrl = "http://localhost:3000";

  useEffect(() => {
    const socket = new SockJS(socketUrl);
    const stompClient = Client.over(socket);

    stompClient.connect({}, () => {
      if (stompClient.connected) {
        stompClient.subscribe(`/topic/currentMeetingUsers/${meeting_id}`, (msg) => {
          const currentMeetingUsers = JSON.parse(msg.body);
          currentMeetingUsers.forEach((user) => {
            addUserToUI(user.user_id, user.connectionId);
            createConnection(user.connectionId);
          });
        });
      }
    });

    return () => {
      stompClient.disconnect();
    };
  }, []);

  const addUserToUI = (other_username, connId) => {
    setUsersConnection((prevUsersConnection) => {
      return {
        ...prevUsersConnection,
        [connId]: { username: other_username }
      };
    });
  };

  const createConnection = async (connId) => {
    const connection = new RTCPeerConnection(iceConfig);

    connection.onicecandidate = (event) => {
      if (event.candidate) {
        sendSDPMessage(JSON.stringify({
          iceCandidate: event.candidate,
        }), connId);
      } else {
        console.log("ice gathering is completed");
      }
    };

    connection.onnegotiationneeded = async () => {
      await createOffer(connId);
    };

    connection.ontrack = (event) => {
      const { kind } = event.track;
      const stream = kind === "video" ? remoteVideoStreamsRef.current[connId] : remoteAudioStreamsRef.current[connId];

      if (!stream) {
        remoteVideoStreamsRef.current[connId] = kind === "video" ? new MediaStream() : new MediaStream();
      }

      const remoteStream = remoteVideoStreamsRef.current[connId];
      remoteStream.getTracks().forEach((t) => remoteStream.removeTrack(t));
      remoteStream.addTrack(event.track);

      // Force re-render by updating state
      setUsersConnection((prevUsersConnection) => {
        const updatedUsersConnection = { ...prevUsersConnection };
        updatedUsersConnection[connId] = { ...updatedUsersConnection[connId], stream: remoteStream };
        return updatedUsersConnection;
      });
    };

    usersConnection[connId] = connection;

    return connection;
  };

  const createOffer = async (connid) => {
    const connection = usersConnection[connid];
    const offer = await connection.createOffer();

    await connection.setLocalDescription(offer);

    sendSDPMessage(JSON.stringify({
      offer: connection.localDescription,
    }), connid);
  };

  const sdpProcess = async (message, from_connid) => {
    message = JSON.parse(message);

    if (message.answer) {
      await usersConnection[from_connid].setRemoteDescription(new RTCSessionDescription(message.answer));
    } else if (message.offer) {
      if (!usersConnection[from_connid]) {
        await createConnection(from_connid);
      }

      await usersConnection[from_connid].setRemoteDescription(new RTCSessionDescription(message.offer));
      const answer = await usersConnection[from_connid].createAnswer();

      await usersConnection[from_connid].setLocalDescription(answer);
      sendSDPMessage(JSON.stringify({
        answer: answer,
      }), from_connid);
    } else if (message.iceCandidate) {
      if (!usersConnection[from_connid]) {
        await createConnection(from_connid);
      }
      try {
        await usersConnection[from_connid].addIceCandidate(message.iceCandidate);
      } catch (error) {
        console.log("error inside the sdp process message.iceCandidate: ", error);
      }
    }
  };

  return (
    <div className="main-wrap">
      <div className="call-wrap card" style={{ zIndex: 99 }}>
        <a id="meetingid" href="#" style={{ color: "black" }}></a>
        <div
          className="remote-video-wrap"
          id="remote-video"
          style={{
            marginBottom: 0,
            backgroundColor: "rgb(131 131 131)",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {Object.keys(usersConnection).map(connId => (
            <RemoteUserVideoCard
              key={connId}
              localName={usersConnection[connId].username}
              showVideo={true}
              playAudio={true}
              stream={usersConnection[connId].stream}
              connId={connId}
            />
          ))}
          <LocalUserVideoCard localName={username} />
        </div>
        <a href="/">Leave</a>
      </div>
    </div>
  );
};

export default VideoStreams;
