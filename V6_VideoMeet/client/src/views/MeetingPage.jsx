import styled from 'styled-components';
import { useEffect } from 'react';
import {useParams} from 'react-router-dom';

import Footer from '../Components/Video Meet/getFooter.jsx';
import { useGlobalState } from '../ContextAPI/GlobalStateContext';
// import { initializeStompClient, disconnectStompClient, getStompClient } from '../services/stompClient';

const MeetingPage = () => {
  const { meetingId } = useParams(); // Get the meetingId from URL params

  const { globalState } = useGlobalState();


  // console.log(globalState.loggedInUserData, 'globalState.loggedInUserData');

  // const onMessageReceived = (payload) => {
  //   console.log(payload, "payload received");
  // };
  // const connectToStompClient = async () => {
  //   // If already connected, return early
  //   if (getStompClient()?.connected) return;

  //   if (globalState.loggedInUserData) {
  //     const initializedSocket = await initializeStompClient();
  //     getStompClient()?.subscribe("/topic/public", onMessageReceived);
  //     // Tell your username to the server
  //     getStompClient()?.send(
  //       "/app/chat.addUser",
  //       {}, // headers
  //       JSON.stringify("Rohan") // body
  //     );
  //     console.log(initializedSocket, "initialized socket!");
  //   }
  // };

  // useEffect(() => {
  //   connectToStompClient()
  //   return () => {
  //     disconnectStompClient();
  //   }
  // }, [globalState.loggedInUserData]);



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
