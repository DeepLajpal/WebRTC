import React, { useState, useRef } from 'react'
import styled from 'styled-components';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import { useGlobalState } from '../../ContextAPI/GlobalStateContext';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
const GetMeetingInfo = ({ handleTabChange }) => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');

  const meetingIdInput = useRef(null);
  const { globalState, updateGlobalState } = useGlobalState()

  const handleChange = (event) => {
    const value = event.target.value;
    if (/^\d{0,8}$/.test(value)) { // Ensure only digits and maximum of 8 characters
      setInputValue(value);
    }
  };

  const handleNavigation = (meetingId, participantId) => {
    updateGlobalState({ meetingId: meetingId });
    console.log('meetingId: ', meetingId);
    navigate(`/meeting/${meetingId}/${participantId}`);
  }
  const handleNewMeeting = async () => {
    // var meetingId = Math.floor(Math.random() * 100000000).toString().padEnd(8, '0');
    // handleTabChange(1);
    try {
      const response = await axios.post('http://localhost:8080/api/createMeeting', { userId: globalState.userId });
      handleNavigation(response.data.data.meeting.shareableMeetingId, response.data.data.participant.participantId);
    }catch(e){
      console.log(e);
    }
  }

  const handleJoin = (event) => {
    const inputValue = meetingIdInput.current.value;

    if (inputValue.length === 8) {
      // handleTabChange(1);
      // updateGlobalState({ meetingId: inputValue });
      // console.log('meetingId: ', inputValue);
      handleNavigation(inputValue);

    }
    else if (inputValue.length === 0) {
      alert("Please Enter a Valid Meeting Id")
    }
    else {
      alert("Meeting Id Should be 8 Digits")
    }
  }

  const handleKeyDown = (event) => {
    const value = event.key;
    if (value === "Enter") {
      handleJoin();
    }
  }
  return (
    <Wrapper>
      <div className='mainDiv'>

        <div className='heading'>
          Video calls and meetings for everyone
        </div>

        <div className="description">
          Video Meet provides secure, easy-to-use video calls and meetings for everyone, on any device.
        </div>


        <div className='endDiv'>

          <div className='startMeetBtnDiv'>
            <Button variant="contained" startIcon={<VideocamIcon />} onClick={handleNewMeeting} size='large'>New Meeting</Button>
          </div>

          <div className='meetingIdInputDiv'>
            <div className='logoDiv'>
              <KeyboardIcon sx={{ position: 'relative', top: '3px' }} />
            </div>
            <div className='inputDiv'>
              <input type="text" ref={meetingIdInput} placeholder='Enter a code' value={inputValue} onChange={handleChange} onKeyDown={handleKeyDown} />
            </div>
          </div>

          <div className='joinMeetBtnDiv'>
            <Button variant="text" onClick={(event) => handleJoin(event)}>Join</Button>
          </div>

        </div>

      </div>
    </Wrapper>
  );
}

export default GetMeetingInfo


const Wrapper = styled.div`


  width:100%;
  height: 80%;
  // border: 2px solid red;
  display:grid;
  place-items:center;


  .mainDiv{
    // border: 2px solid black;
    height: 50%;
    display: grid;
    align-items: center;
    justify-items: center;
    row-gap: 5%;

    .heading{
      font-size: xx-large;
      align-self: end;
    }
    
    .description{
      font-size: larger;
    }

    .endDiv{
      display: grid;
      align-items: center;
      justify-items:center;
      grid-auto-flow:column;
      gap:20px;
      align-self: start;

      .meetingIdInputDiv{
        display: grid;
        grid-auto-flow:column;
        place-content:center;
        place-items: center;
        gap:5px;
        border: 1px solid black;
        border-radius: 4px;
        padding: 3%;

        .inputDiv{
          
          input{
            border:none;
            background:transparent;
          }
          input:focus {
            outline:none;
          }
        }
      }
    }
  }

`