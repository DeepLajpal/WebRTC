import React, { useEffect } from 'react'
import styled from 'styled-components';
import ShowNav from '../Components/Video Meet/getNav';
import GetMeetingInfo from '../Components/Video Meet/getMeetingInfo';
import IconTabs from '../Components/Common/showTab';
import GetUserInfo from '../Components/Video Meet/getUserInfo';

const Home = () => {

  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (newValue) => {
    setTabValue(newValue);
  };

  return (
    <Wrapper>
      <div className='startDiv' onClick={()=>handleTabChange(0)}>
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