import React from 'react';
import Footer from '../Components/footer.jsx';
import VideoElement from '../Components/VideoElement.jsx';
import styled from 'styled-components';

const Stream = () => {
  return (
    <Wrapper>
      <VideoElement/>
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
