import React, { useEffect } from 'react';
import Footer from '../Components/Video Meet/getFooter.jsx';
import GetVideoContainers from '../Components/Video Meet/getVideoContainers.jsx';
import styled from 'styled-components';
import initSocket from '../utility/socketConnection.jsx';
import { useGlobalState } from '../ContextAPI/GlobalStateContext';

const Stream = () => {
  const { globalState } = useGlobalState();
  useEffect(()=>{
    initSocket(globalState.name, globalState.meetingId);
  },[globalState.name, globalState.meetingId])
  return (
    <Wrapper>
      <GetVideoContainers/>
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
