import TextField from '@mui/material/TextField';
import React, { useRef } from 'react'
import styled from 'styled-components';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../ContextAPI/GlobalStateContext';



const GetUserInfo = () => {
    const meetingIdInput = useRef(null);
    const navigate = useNavigate();
    const { globalState, updateGlobalState } = useGlobalState();


    const handleJoinMeet = (event) => {
        const value = meetingIdInput.current.value;

        if (value.length === 0) {
            return alert("Please Enter a Valid Name")
        }
        updateGlobalState({ tabValue: 0, name: value });
        console.log('name: ', value);
        navigate('/stream')
    }

    const handleKeyDown = (event) => {
        const value = event.key;
        if (value === "Enter") {
            handleJoinMeet()
        }
    }

    return (
        <Wrapper>
            <div className='mainDiv'>
                <div className='startDiv'>
                    <p>What's your name?</p>
                </div>
                <div className='MiddleDiv'>
                    <TextField inputRef={meetingIdInput} id="filled-basic" label="Your name" variant="filled" onKeyDown={handleKeyDown} autoFocus/>
                </div>
                <div className='endDiv'>
                    <Button variant="contained" sx={{ borderRadius: '65px' }} onClick={handleJoinMeet}>Join Meet</Button>
                </div>
            </div>
        </Wrapper>
    )
}


export default GetUserInfo;


const Wrapper = styled.section`

// border:2px solid red;
height:80%;
display: grid;
place-items: center;

    .mainDiv{
        // border: 2px solid green;
        width: 35%;
        height: 42%;
        min-height:181px;
        display: grid;
        justify-content: center;
        justify-items: center;

        .startDiv{
            font-size:20px;
        }
    }


`