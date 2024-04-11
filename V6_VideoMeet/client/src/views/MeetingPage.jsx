import React, { useEffect, useRef, useState } from 'react';
import Footer from '../Components/Video Meet/getFooter.jsx';
import styled from 'styled-components';
import initSocket from '../utility/socketConnection.jsx';
import { useGlobalState } from '../ContextAPI/GlobalStateContext.jsx';
import LocalUsersCard from '../Components/Video Meet/getLocalUsersCard.jsx';
import InitializeSocket from '../utility/getInitializeSocket.jsx';
import GetLocalUserMedia from '../Components/Video Meet/getLocalUserDevice.jsx';
import {useParams} from 'react-router-dom';

const MeetingPage = () => {
  const { meetingId } = useParams(); // Get the meetingId from URL params

  // const [usersConnection, setUsersConnection]  = useState([]); // Array to store user connections
  // var remoteVideoStream = []; // Array to store remote video streams
  // const [mediaStream, setMediaStream] = useState(null);

  // var remoteVideosRef = useRef({});

  // const { globalState } = useGlobalState();
  // const [existingUsersData, setExistingUsersData] = useState([]);

// useEffect(()=>console.log("mediaStream of stream page"),[mediaStream])


  return (
    <Wrapper>
      {/* <LocalUsersCard
        localName={globalState.name}
        showVideo={globalState.Video}
        playAudio={globalState.Mic}
        setMediaStream={setMediaStream}
      /> */}
      {/* <GetLocalUserMedia mediaStream={mediaStream} setMediaStream = {setMediaStream}/> */}
      {/* <InitializeSocket/> */}
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
