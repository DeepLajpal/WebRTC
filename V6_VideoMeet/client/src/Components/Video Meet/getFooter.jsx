import React, { useEffect, useState } from 'react';
import { MdCallEnd } from "react-icons/md";
import { IoMdMic } from "react-icons/io";
import { IoMdMicOff } from "react-icons/io";
import { BiSolidVideo } from "react-icons/bi";
import { BiSolidVideoOff } from "react-icons/bi";
import { BsPeopleFill } from "react-icons/bs";
import { BsPeople } from "react-icons/bs";
import Fab from '@mui/material/Fab';
import styled from 'styled-components';
import TempDrawer from '../Common/showDrawer';
import { useGlobalState } from '../../ContextAPI/GlobalStateContext';
import { useNavigate } from 'react-router-dom'
import ShowBadge from '../Common/showBadge';


const Footer = ({localMeetingId}) => {
  const navigate = useNavigate()
  const [ date, setDate ] = useState(new Date());
  const { globalState, updateGlobalState } = useGlobalState();
  const micBtnStyle = globalState.Mic ? "onBtn" : "offBtn";
  const VideoBtnStyle = globalState.Video ? "onBtn" : "offBtn";

  const handleToggle = (handleAction) => {
    switch (handleAction) {
      case "Mic":
        updateGlobalState({ Mic: !globalState.Mic });
        break;

      case "Video":
        updateGlobalState({ Video: !globalState.Video });
        break;

      case "viewPeople":
        updateGlobalState({ viewPeople: !globalState.viewPeople });
        break;

      default:
        console.log("No Match Inside Toggle")
        break;
    }
  }

  const options = {
    hour: '2-digit',
    minute: '2-digit'
  };
  const time = date.toLocaleTimeString('en-US', options);

  useEffect(()=>{
    const date = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => {
      clearInterval(date);
    }
  }, [])
  
  return (
    <footer>
      <Wrapper className='container'>
        <div className='leftGrid'>
          <div className='leftGridItem'>
            <span className='time'>{time}  |  </span>
            <span className='meetingId'>{localMeetingId}</span>
          </div>
        </div>
        <div className='middleGrid'>
          <Fab className={`micIcon icon ${micBtnStyle}`} onClick={(e) => handleToggle("Mic")}>
            {globalState.Mic ? <IoMdMic /> : <IoMdMicOff />}
          </Fab>
          <Fab className={`videoIcon icon ${VideoBtnStyle}`} onClick={(e) => handleToggle("Video")}>
            {globalState.Video ? <BiSolidVideo /> : <BiSolidVideoOff />}
          </Fab>
          <Fab className='endCallIcon icon' onClick={(e) => navigate('/')} variant="extended" >
            <MdCallEnd />
          </Fab>
        </div>
        <div className='rightGrid'>
          <ShowBadge top={"10%"} right={"15%"} background={"#5F6368"} icon={
            <Fab className='peopleIcon' onClick={(e) => handleToggle("viewPeople")} sx={{ zIndex: '5000' }}>
              {globalState.viewPeople ? <BsPeople /> : <BsPeopleFill style={{ color: "#8AB4F8", }} />}
              <TempDrawer />
            </Fab>} />
        </div>
      </Wrapper>
    </footer>

  )
}

export default Footer

const Wrapper = styled.div`
 
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  position: fixed;
  bottom: 2%;
  width: 100%;


.rightGrid,
.leftGrid {
  display: grid;
  place-content: center;
  place-items: center;
}

.leftGrid {
  font-family: "Google Sans", Roboto, Arial, sans-serif;
  line-height: 1.5rem;
  font-size: 1rem;
  letter-spacing: .00625em;
  font-weight: 500;
  color: white;
  max-width: 400px;
  user-select: text;
}

.middleGrid {
  display: grid;
  grid-template-columns: 20% 20% 40%;
  justify-content: center;
  column-gap: 0 0 4vw;
}
.micIcon,
.videoIcon {
  justify-self: center;
}

.micIcon {
  justify-self: end;
}

.icon {
  align-self: center !important;
  font-size: 24px !important;
  color: white !important;
  background-color: #3c4043 !important;
}
.endCallIcon {
  background-color: #ea4335 !important;
}

.leftGrid {
  justify-content: start;
  margin-left:8%;
}
.rightGrid {
  justify-content: end;
  margin-right:8%;
}

.peopleIcon, .peopleIcon:hover {
  background:transparent;
  color:white;
  font-size: 24px;
  cursor: pointer;
}

.offBtn {
  background-color: #ea4335 !important;
}
.onBtn {
  background-color: #3c4043 !important;
}

`


