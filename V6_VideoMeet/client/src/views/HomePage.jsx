import React, { useEffect } from 'react'
import styled from 'styled-components';
import ShowNav from '../Components/Video Meet/getNav';
import GetMeetingInfo from '../Components/Video Meet/getMeetingInfo';
import { useGlobalState } from '../ContextAPI/GlobalStateContext';
import { initializeStompClient, disconnectStompClient, getStompClient } from '../services/stompClient';

const Home = () => {

  const [tabValue, setTabValue] = React.useState(0);
  const { globalState, updateGlobalState } = useGlobalState();

  const handleTabChange = (newValue) => {
    setTabValue(newValue);
  };

  console.log(globalState.loggedInUserData, 'globalState.loggedInUserData');

  const onMessageReceived = (payload) => {
    console.log(payload, "payload received");
  };
  const connectToStompClient = async () => {
    // If already connected, return early
    if (getStompClient()?.connected) return;

    if (globalState.loggedInUserData) {
      const initializedSocket = await initializeStompClient();
      getStompClient()?.subscribe("/topic/public", onMessageReceived);
      // Tell your username to the server
      getStompClient()?.send(
        "/app/chat.addUser",
        {}, // headers
        JSON.stringify("Rohan") // body
      );
      console.log(initializedSocket, "initialized socket!");
    }
  };

  useEffect(() => {
    connectToStompClient()
    return () => {
      disconnectStompClient();
    }
  }, [globalState.loggedInUserData]);

  return (
    <Wrapper>
      {/* <WebSocketComponent /> */}
      <div className='startDiv' onClick={()=>handleTabChange(0)}>
        <ShowNav logoName={"Video Meet"} />
      </div>
      <div className='middleDiv'>
             <GetMeetingInfo handleTabChange={handleTabChange} /> 
      </div>
    </Wrapper>
  );
}

export default Home


const Wrapper = styled.div`

display:grid;
grid-template-rows: max-content 1fr;
height:100%;
width:100%;


`