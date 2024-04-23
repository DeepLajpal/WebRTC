import Footer from '../Components/Video Meet/getFooter.jsx';
import styled from 'styled-components';

import {useParams} from 'react-router-dom';
import SocketConfig from '../utility/socketConfig.jsx';

const MeetingPage = () => {
  const { meetingId } = useParams(); // Get the meetingId from URL params

  return (
    <Wrapper>
      {meetingId && <SocketConfig meetingId = {meetingId} userName = "Deep"/>}
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
