
import Footer from '../Components/Video Meet/getFooter.jsx';
import styled from 'styled-components';
// import useSocket from "../utility/useSocket";
import {useParams} from 'react-router-dom';
import { useEffect } from 'react';
import { getStompClient, initializeStompClient } from '../connections/stompClient.jsx';
// import { useEffect } from 'react';

const MeetingPage = () => {
  const { meetingId } = useParams(); // Get the meetingId from URL params

  const onMessageReceived = (payload) => { console.log(payload)};
  const connectToStompClient = async () => {
    // If already connected, return early
    if (getStompClient()?.connected) return;

    // let username = signupData?.name.trim();
    // dispatch(setUsername(username));
      const initializedSocket = await initializeStompClient();
      getStompClient()?.subscribe("/topic/public", onMessageReceived);
      // Tell your username to the server
      getStompClient()?.send(
        "/app/chat.addUser",
        {}, // headers
        JSON.stringify("Deep Lajpal") // body
      );
      console.log(initializedSocket, "initialized socket!");
  };

  useEffect(() => {
    console.log("connecting to socket!")
    connectToStompClient();
    // return disconnectStompClient()
  }, []);


  return (
    <Wrapper>
      {/* <LocalUsersCard
        localName={globalState.name}
        showVideo={globalState.Video}
        playAudio={globalState.Mic}
        setMediaStream={setMediaStream}
      /> */}
      <Footer localMeetingId={meetingId} />
    </Wrapper>
  );
}

export default MeetingPage;

const Wrapper = styled.div`
height:100%;
width:100%;
background:#202124;
`;
