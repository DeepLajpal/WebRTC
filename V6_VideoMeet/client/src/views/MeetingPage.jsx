
import Footer from '../Components/Video Meet/getFooter.jsx';
import styled from 'styled-components';
import {useParams} from 'react-router-dom';

// import { useEffect } from 'react';

const MeetingPage = () => {
  const { meetingId } = useParams(); // Get the meetingId from URL params



  return (
    <Wrapper>
      {/* <LocalUsersCard
        localName={globalState.name}
        showVideo={globalState.Video}
        playAudio={globalState.Mic}
        setMediaStream={setMediaStream}
      /> */}
      <Footer localMeetingId={meetingId} />
    </Wrapper>
  );
}

export default MeetingPage;

const Wrapper = styled.div`
height:100%;
width:100%;
background:#202124;
`;
