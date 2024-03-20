import React from 'react'
import styled from 'styled-components';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
const GetMeetingInfo = () => {
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
                            <Button variant="contained" startIcon={<VideocamIcon />} size='large'>New Meeting</Button>
                        </div>

                        <div className='meetingIdInputDiv'>
                            <div className='logoDiv'>
                                <KeyboardIcon sx={{ position: 'relative', top: '3px' }} />
                            </div>
                            <div className='inputDiv'>
                                <input type="text" placeholder='Enter a code' />
                            </div>
                        </div>

                        <div className='joinMeetBtnDiv'>
                            <Button variant="text">Join</Button>
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