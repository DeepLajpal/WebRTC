import styled from 'styled-components';
import ShowNav from '../Components/Video Meet/getNav';
import GetMeetingInfo from '../Components/Video Meet/getMeetingInfo';


const Home = () => {

  return (
    <Wrapper>
      {/* <WebSocketComponent /> */}
      <div className='startDiv' >
        <ShowNav logoName={"Video Meet"} />
      </div>
      <div className='middleDiv'>
        <GetMeetingInfo />
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