import React, { useEffect } from 'react';
import Footer from '../Components/Video Meet/getFooter.jsx';
import GetVideoContainers from '../Components/Video Meet/getVideoContainers.jsx';
import styled from 'styled-components';
import initSocket from '../utility/socketConnection.jsx';
import { useGlobalState } from '../ContextAPI/GlobalStateContext';


const Stream = () => {
  const { globalState, updateGlobalState } = useGlobalState();
  useEffect(() => {
    const socket = initSocket(globalState.name, globalState.meetingId, globalState.existingUsersData, updateGlobalState);

    socket.on
    return () => {
      socket.disconnect();
      console.log('socket clenup done');
    }
  }, [])
  return (
    <Wrapper>
      <GetVideoContainers localName = {globalState.name} localMeetingId = {globalState.meetingId} existingUsersData={globalState.existingUsersData}/>
      <Footer />
    </Wrapper>
  );
}

export default Stream;

const Wrapper = styled.div`
height:100%;
width:100%;
background:#202124;
`;
