import React from 'react'
import styled from 'styled-components';
import ShowNav from '../Components/Video Meet/getNav';
import GetMeetingDetails from '../Components/Video Meet/getMeetingDetails';

const Home = () => {
  return (
    <Wrapper>
      <ShowNav logoName={"Video Meet"} />
      <GetMeetingDetails/>
    </Wrapper>
  );
}

export default Home


const Wrapper = styled.div`

height:100%;
width:100%;
`