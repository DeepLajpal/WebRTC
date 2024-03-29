import React, { useState, useEffect, useRef } from 'react';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import styled from 'styled-components';
import { useGlobalState } from '../../ContextAPI/GlobalStateContext';
import { IoMdMic } from "react-icons/io";
import { IoMdMicOff } from "react-icons/io";
import Avatar from '@mui/joy/Avatar';


const MultiUsersCard = () => {

    const { globalState } = useGlobalState();

    const smallVideoStyling = {
        cardStyling: { minWidth: '234px', width: '234px', minHeight: '132px', height: '132px', background: !globalState.Video ? '#4A4E51' : 'none' },
        cardCoverStyling: { display: !globalState.Video ? 'none' : null },
    }

    return (
        <Wrapper>
            {[{ name: "user1" }, { name: "user2" }, { name: "user3" }, { name: "user1" }, { name: "user2" }, { name: "user3" }].map((user, index) => {

                return <Card key={index} className='smallVideoMainCard' component="li" sx={smallVideoStyling.cardStyling}>
                    <CardCover sx={smallVideoStyling.cardCoverStyling}>
                        <video className='localVideo'
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
