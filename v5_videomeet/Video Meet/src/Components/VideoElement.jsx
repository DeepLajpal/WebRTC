import React, { useState, useEffect, useRef } from 'react';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import styled from 'styled-components';
import Fab from '@mui/material/Fab';
import { useGlobalState } from '../ContextAPI/GlobalStateContext';
import { IoMdMic } from "react-icons/io";
import { IoMdMicOff } from "react-icons/io";

const VideoElement = () => {

    const { globalState, updateGlobalState } = useGlobalState();
    const smallSizeVideoRef = useRef(null)

    useEffect(() => {
        if (globalState.Video) {
            smallSizeVideoRef.current.play();
        } else {
            smallSizeVideoRef.current.pause();
        }
    }, [globalState.Video])

    const picRandomColor = () => {
        return globalState.profileBackgroundColors[Math.floor(Math.random() * globalState.profileBackgroundColors.length)];
    };
    console.log(picRandomColor());

    var overlay = true;


    return (
        <Wrapper className='videoElement' color={picRandomColor()}>
            <Card className='smallVideoMainCard' component="li" sx={{ minWidth: '234px', width: '234px', height: '132px', position: 'absolute', inset: 'auto 5% 5% auto', zIndex: '1' }}>
                <CardCover>
                    <video
                        autoPlay
                        loop
                        muted
                        poster="https://assets.codepen.io/6093409/river.jpg"
                        ref={smallSizeVideoRef}
                    >
                        <source
                            src="https://assets.codepen.io/6093409/river.mp4"
                            type="video/mp4"
                        />
                    </video>
                </CardCover>
                <CardContent sx={{ minWidth: '234px', width: '234px', height: '132px' }}>
                    <Typography
                        level="body-lg"
                        fontWeight="lg"
                        textColor='white'
                        fontSize="16px"
                        mt={{ xs: 10, sm: 10.5 }}
                    >
                        {globalState.name}
                    </Typography>
                    <Typography
                        level="body-lg"
                        fontWeight="lg"
                        textColor='white'
                        sx={{ position: 'absolute', top: '4%', right: '4%' }}
                    >
                        <Fab size="small" className={`micIcon icon`}>
                            {globalState.Mic ? <IoMdMic /> : <IoMdMicOff />}
                        </Fab>
                    </Typography>
                </CardContent>
            </Card>

            {!globalState.Video ? <Card className='smallVideoOverlayCard' sx={{ minWidth: '234px', width: '234px', height: '132px', position: 'absolute', inset: 'auto 5% 5% auto', zIndex: '1', background: '#4A4E51' }}>
                <div className='profileContainer'>
                    {globalState.profileImg ? <img className='image' src="./Man.webp" alt="profile picture" /> : <div className='text'><span>{globalState.name[0].toUpperCase()}</span></div>}
                </div>
                <CardContent sx={{ minWidth: '234px', width: '234px', height: '132px' }}>
                    <Typography
                        level="body-lg"
                        fontWeight="500"
                        textColor='white'
                        fontSize="16px"
                        mt={{ xs: 9, sm: 9 }}
                    >
                        {globalState.name}
                    </Typography>
                    <Typography
                        level="body-lg"
                        fontWeight="lg"
                        textColor='white'
                        sx={{ position: 'absolute', top: '4%', right: '4%' }}
                    >
                        <Fab size="small" className={`micIcon icon`}>
                            {globalState.Mic ? <IoMdMic /> : <IoMdMicOff />}
                        </Fab>
                    </Typography>
                </CardContent>
            </Card> : null}

            <Card className='BigVideoMainCard' component="li" sx={{ minWidth: '234px', width: '70vw', height: '95%', background: overlay ? '#4A4E51' : 'none' }}>
                <div className='BigprofileContainer'>
                    {globalState.profileImg ? <img className='image' src="./Man.webp" alt="profile picture" /> : <div className='bigVideoProfileText'><span>{globalState.name[0].toUpperCase()}</span></div>}
                </div>
                <CardCover sx={{ display: overlay ? 'none' : true }}>
                    <video
                        autoPlay
                        loop
                        muted
                        poster="https://assets.codepen.io/6093409/river.jpg"
                    >
                        <source
                            src="https://assets.codepen.io/6093409/river.mp4"
                            type="video/mp4"
                        />
                    </video>
                </CardCover>
                <CardContent sx={{ minWidth: '234px', width: '234px', height: '132px' }}>
                    <Typography
                        level="body-lg"
                        fontWeight="lg"
                        textColor='white'
                        sx={{ position: 'absolute', bottom: '2%', left: '2%' }}
                    >
                        {globalState.name}
                    </Typography>
                    <Typography
                        level="body-lg"
                        fontWeight="lg"
                        textColor='white'
                        sx={{ position: 'absolute', top: '2%', right: '2%' }}
                    >
                        <Fab size="small" className={`micIcon icon`}>
                            {globalState.Mic ? <IoMdMic /> : <IoMdMicOff />}
                        </Fab>
                    </Typography>
                </CardContent>
            </Card>

        </Wrapper>
    );
}

export default VideoElement;

const Wrapper = styled.div`
position:absolute;
inset: 16px 16px 80px;
box-sizing:border-box;
display:grid;
justify-items: center;
align-items: center;

.icon {
    align-self: center !important;
    color: white !important;
    background-color: #3c4043 !important;
  }

.profileContainer{
    width:100%;
    height:100%;
}

.bigVideoProfileText, .text, .image{
    position: absolute;
    inset: 50% auto auto 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    display: grid;
    justify-content: center;
    align-items: center;
    align-content: center;
    justify-items: center;
    font-size: 2rem;
    font-weight: 500;
    padding: 1.8rem;
    border-radius: 50%;
    color: white;
    background:${props => props.color}
}

.bigVideoProfileText{
    padding: 2.8rem;
    font-size: 3rem;
}

`;
