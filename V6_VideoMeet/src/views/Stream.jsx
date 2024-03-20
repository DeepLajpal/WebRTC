import React from 'react';
import Footer from '../Components/Video Meet/getFooter.jsx';
import GetVideoContainers from '../Components/Video Meet/getVideoContainers.jsx';
import styled from 'styled-components';

const Stream = () => {
  return (
    <Wrapper>
      <GetVideoContainers small={false}/>
      <GetVideoContainers small={true}/>
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
