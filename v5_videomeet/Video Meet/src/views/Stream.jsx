import React from 'react';
import Footer from '../Components/footer.jsx';
import VideoElement from '../Components/videoElement.jsx';
import styled from 'styled-components';

const Stream = () => {
  return (
    <Wrapper>
      <VideoElement small={false}/>
      <VideoElement small={true}/>
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
