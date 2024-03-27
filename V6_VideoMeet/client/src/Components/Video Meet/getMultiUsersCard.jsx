import React, { useState, useEffect, useRef } from 'react';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import styled from 'styled-components';
import { useGlobalState } from '../../ContextAPI/GlobalStateContext';
import { IoMdMic } from "react-icons/io";
import { IoMdMicOff } from "react-icons/io";
import Avatar from '@mui/joy/Avatar';


const MultiUsersCard = () => {

    const { globalState, updateGlobalState } = useGlobalState();
    const localVideoRef = useRef(null);
    const videoRefs = useRef([]);
    
    useEffect(() => {
        // Update the global state with references to video elements
        updateGlobalState({ localVideoRef, videoRefs: videoRefs.current });
        console.log("global")
    }, [globalState.localVideoRef, videoRefs.current]);

    const handleVideoRef = (index) => (ref) => {
        // Store reference to the video element
        videoRefs.current[index] = ref;
        console.log(index, ": ", videoRefs.current[index]);
    };

    const smallVideoStyling = {
        cardStyling: { minWidth: '234px', width: '234px', minHeight: '132px', height: '132px', background: !globalState.Video ? '#4A4E51' : 'none' },
        cardCoverStyling: { display: !globalState.Video ? 'none' : null },
    }

    return (
        <Wrapper>
            <Card className='smallVideoMainCard' component="li" sx={smallVideoStyling.cardStyling}>
                <CardCover sx={smallVideoStyling.cardCoverStyling}>
                    <video ref={localVideoRef}
                        autoPlay
                        loop
                        muted
                    >
                    </video>
                </CardCover>
                <div className='cardContent' style={{ height: '100%', width: '100%' }}>
                    <div className='micDiv'>
                        <Avatar sx={{ background: '#3E4044', color: 'white' }} color='white' alt={'Mic'} size="sm" > {globalState.Mic ? <IoMdMic /> : <IoMdMicOff />} </Avatar>
                    </div>
                    <div className='avatarDiv'>
                        <Avatar alt={globalState.name} size="md" />
                    </div>
                    <div className='userNameDiv' >
                        {globalState.name}
                    </div>
                </div>
            </Card>
            {globalState.remoteUsers.map((user, index) => {
                return <Card key={index} className='smallVideoMainCard' component="li" sx={smallVideoStyling.cardStyling}>
                    <CardCover sx={smallVideoStyling.cardCoverStyling}>
                        <video ref={handleVideoRef(index)}
                            autoPlay
                            loop
                            muted
                        >
                        </video>
                    </CardCover>
                    <div className='cardContent' style={{ height: '100%', width: '100%' }}>
                        <div className='micDiv'>
                            <Avatar sx={{ background: '#3E4044', color: 'white' }} color='white' alt={'Mic'} size="sm" >{globalState.Mic ? <IoMdMic /> : <IoMdMicOff />}</Avatar>
                        </div>
                        <div className='avatarDiv'>
                            <Avatar alt={user.name} size="md" />
                        </div>
                        <div className='userNameDiv' >
                            {user.name}
                        </div>
                    </div>
                </Card>
            })}
        </Wrapper>
    );
}

export default MultiUsersCard;

const Wrapper = styled.div`
width: 100%;
height: 100%;
box-sizing: border-box;
display: grid;
justify-content: center;
align-content: center;
justify-items: center;
align-items: center;
gap: 10px;
grid-template-columns: repeat(auto-fit, 234px);
grid-auto-rows: 132px;


.cardContent{
    display: grid;
    place-items:center;

    .micDiv{
        justify-self: end;
    }
    .avatarDiv{
        justify-self: center;
    }
    .userNameDiv{
        justify-self: start;
        color: white;
        z-index: 1;
    }
}



`;
