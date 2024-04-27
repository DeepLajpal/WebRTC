import styled from 'styled-components';
import {useParams} from 'react-router-dom';

import Footer from '../Components/Video Meet/getFooter.jsx';
import { useGlobalState } from '../ContextAPI/GlobalStateContext';
import VideoStreams from '../Components/Video Meet/getVideoStreams.jsx';

const MeetingPage = () => {
  const { meetingId } = useParams(); // Get the meetingId from URL params
  const { globalState } = useGlobalState();

  return (
    <Wrapper>
      <VideoStreams
        username={globalState.name}
        meetingId={meetingId}
      />
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
