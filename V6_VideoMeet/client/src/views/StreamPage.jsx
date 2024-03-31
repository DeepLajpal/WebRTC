import React, { useEffect, useState } from 'react';
import Footer from '../Components/Video Meet/getFooter.jsx';
import GetVideoContainers from '../Components/Video Meet/getVideoContainers.jsx';
import styled from 'styled-components';
import initSocket from '../utility/socketConnection.jsx';
import { useGlobalState } from '../ContextAPI/GlobalStateContext';


const Stream = () => {
  const { globalState, updateGlobalState } = useGlobalState();
  const [ existingUsersData, setExistingUsersData ] = useState([]);
  useEffect(() => {
    const socket = initSocket(globalState.name, globalState.meetingId, existingUsersData, setExistingUsersData);
    

    socket.on("currentMeetingUsers_to_inform_about_new_connection_information", function (data) {
      setExistingUsersData(prevUsers => [...prevUsers, data]);
    });

    socket.on("new_user_to_inform_about_currentMeetingUsers", function (currentMeetingUsers) {
      for (let i = 0; i < currentMeetingUsers.length; i++) {
        setExistingUsersData(prevUsers => [...prevUsers, currentMeetingUsers[i]]);
      }
    });

    socket.on('closedConnectionInfo', function (closedConnectionID) {
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
      <GetVideoContainers localName={globalState.name} localMeetingId={globalState.meetingId} existingUsersData={existingUsersData} />
      <Footer localMeetingId={globalState.meetingId}/>
    </Wrapper>
  );
}

export default Stream;

const Wrapper = styled.div`
height:100%;
width:100%;
background:#202124;
`;
