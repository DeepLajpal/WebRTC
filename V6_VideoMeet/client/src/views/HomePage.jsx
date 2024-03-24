import React, { useEffect } from 'react'
import styled from 'styled-components';
import ShowNav from '../Components/Video Meet/getNav';
import GetMeetingInfo from '../Components/Video Meet/getMeetingInfo';
import IconTabs from '../Components/Common/showTab';
import GetUserInfo from '../Components/Video Meet/getUserInfo';
import { initSocket } from '../utility/socketConnection';
import { useGlobalState } from '../ContextAPI/GlobalStateContext';

const Home = () => {

  const [tabValue, setTabValue] = React.useState(0);
  const { globalState } = useGlobalState();

  const handleTabChange = (newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (!globalState?.name || !globalState?.meetingId) return;
    initSocket(globalState?.name, globalState?.meetingId)
      .then((socket) => {
        console.log('Socket initialized');
      }).catch((error) => {
        console.error('Error initializing socket:', error);
      });
  }, [globalState?.name, globalState?.meetingId]);
  return (
    <Wrapper>
      <div className='startDiv'>
        <ShowNav logoName={"Video Meet"} />
      </div>
      <div className='middleDiv'>
        <IconTabs handleTabChange={handleTabChange} tabValue={tabValue} />
      </div>
      <div className='endDiv'>
        {
          !tabValue
            ? <GetMeetingInfo handleTabChange={handleTabChange} />
            : <GetUserInfo handleTabChange={handleTabChange} />
        }
      </div>
    </Wrapper>
  );
}

export default Home


const Wrapper = styled.div`

display:grid;
grid-template-rows: max-content 20% 1fr;
height:100%;
width:100%;

  .middleDiv{
        justify-self: center;
        height: fit-content;
        align-self:end;
  }
`