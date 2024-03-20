import React from 'react'
import styled from 'styled-components';
import ShowNav from '../Components/Video Meet/getNav';
import GetMeetingInfo from '../Components/Video Meet/getMeetingInfo';
import IconTabs from '../Components/Common/showTab';
import GetUserInfo from '../Components/Video Meet/getUserInfo';
import { useGlobalState } from '../ContextAPI/GlobalStateContext';

const Home = () => {

  const { globalState} = useGlobalState();
  return (
    <Wrapper>
      <div className='startDiv'>
        <ShowNav logoName={"Video Meet"} />
      </div>
      <div className='middleDiv'>
        <IconTabs />
      </div>
      <div className='endDiv'>
        {!globalState.tabValue ? <GetMeetingInfo /> : <GetUserInfo />}
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