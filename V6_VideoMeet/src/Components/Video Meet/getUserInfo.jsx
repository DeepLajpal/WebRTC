import TextField from '@mui/material/TextField';
import React from 'react'
import styled from 'styled-components';
import Button from '@mui/material/Button';

const GetUserInfo = () => {
    return (
        <Wrapper>
            <div className='mainDiv'>
                <div className='startDiv'>
                    <p>What's your name?</p>
                </div>
                <div className='MiddleDiv'>
                    <TextField id="filled-basic" label="Your name" variant="filled" />
                </div>
                <div className='endDiv'>
                    <Button variant="contained" sx={{borderRadius:'65px'}}>Join Meet</Button>
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