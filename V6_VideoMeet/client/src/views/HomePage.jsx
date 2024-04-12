import React, { useEffect } from 'react'
import styled from 'styled-components';
import ShowNav from '../Components/Video Meet/getNav';
import GetMeetingInfo from '../Components/Video Meet/getMeetingInfo';
import IconTabs from '../Components/Common/showTab';
import GetUserInfo from '../Components/Video Meet/getUserInfo';
import { useGlobalState } from '../ContextAPI/GlobalStateContext';

const Home = () => {

  const [tabValue, setTabValue] = React.useState(0);
  const { globalState, updateGlobalState } = useGlobalState();

  const handleTabChange = (newValue) => {
    setTabValue(newValue);
  };

  console.log(globalState.loggedInUserData, 'globalState.loggedInUserData');
  return (
    <Wrapper>
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