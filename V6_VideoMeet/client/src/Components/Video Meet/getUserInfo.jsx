import TextField from '@mui/material/TextField';
import React, { useRef } from 'react'
import styled from 'styled-components';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../ContextAPI/GlobalStateContext';



const GetUserInfo = ({ handleTabChange }) => {
    const meetingIdInput = useRef(null);
    const navigate = useNavigate();
    const { updateGlobalState } = useGlobalState();

    const handleJoinMeet = (event) => {
        const inputValue = meetingIdInput.current.value;

        if (inputValue.length === 0) {
            return alert("Please Enter a Valid Name")
        }
        updateGlobalState({name: inputValue})
        handleTabChange(0);
        console.log('name: ', inputValue);
        navigate('/stream')
    }

    const handleKeyDown = (event) => {
        const keyPressed = event.key;
        if (keyPressed === "Enter") {
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