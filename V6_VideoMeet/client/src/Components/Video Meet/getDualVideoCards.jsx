import React, { useState, useEffect, useRef } from 'react';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import styled from 'styled-components';
import { useGlobalState } from '../../ContextAPI/GlobalStateContext';
import { IoMdMic } from "react-icons/io";
import { IoMdMicOff } from "react-icons/io";
import Avatar from '@mui/joy/Avatar';



const DualVideoCards = ({ small }) => {

    const { globalState, updateGlobalState } = useGlobalState();
    
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        updateGlobalState({ localVideoRef, remoteVideoRef });
    }, [localVideoRef, remoteVideoRef]);


    const smallVideoStyling = {
        cardStyling: { minWidth: '234px', width: '234px', height: '132px', position: 'absolute', inset: 'auto 5% 5% auto', zIndex: '1', background: !globalState.Video ? '#4A4E51' : 'none' },
        cardCoverStyling: { display: !globalState.Video ? 'none' : null },
        cardContentAvatarStyling: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: !globalState.Video ? null : 'none' },
        cardContentUserNameStyling: { position: 'absolute', bottom: '4%', left: '4%', color: 'white', fontFamily: 'inter', fontWeight: '600' },
        cardContentMicStyling: { position: 'absolute', top: '4%', right: '4%' },
    }

    const bigVideoStyling = {
        cardStyling: { minWidth: '70vw', width: '70vw', height: '95%', background: !globalState.Video ? '#4A4E51' : 'none' },
        cardCoverStyling: { display: !globalState.Video ? 'none' : null },
        cardContentAvatarStyling: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: !globalState.Video ? null : 'none' },
        cardContentUserNameStyling: { position: 'absolute', bottom: '2%', left: '2%', color: 'white', fontFamily: 'inter', fontWeight: '600' },
        cardContentMicStyling: { position: 'absolute', top: '2%', right: '2%' },
    }

    return (
        <Wrapper>
            {small ? <Card className='smallVideoMainCard' component="li" sx={smallVideoStyling.cardStyling}>
                <CardCover sx={smallVideoStyling.cardCoverStyling}>
                    <video
                        autoPlay
                        loop
                        muted
                        ref={localVideoRef}
                    >
                    </video>
                </CardCover>
                <div className='cardContent'>
                    <div className='avatarDiv' style={smallVideoStyling.cardContentAvatarStyling}>
                        <Avatar alt={globalState.name} size="md" />
                    </div>
                    <div className='userNameDiv' style={smallVideoStyling.cardContentUserNameStyling}>
                        {globalState.name}
                    </div>
                    <div className='micDiv' style={smallVideoStyling.cardContentMicStyling}>
                        <Avatar sx={{ background: '#3E4044', color: 'white' }} color='white' alt={'Mic'} size="sm" >{globalState.Mic ? <IoMdMic /> : <IoMdMicOff />}</Avatar>
                    </div>
                </div>
            </Card>
                : <Card className={`BigVideoMainCard`} component="li" sx={bigVideoStyling.cardStyling}>
                    <CardCover sx={bigVideoStyling.cardCoverStyling}>
                        <video
                            autoPlay
                            loop
                            muted
                            ref={globalState.existingUsers === 2 ? remoteVideoRef : localVideoRef}
                        >
                        </video>
                    </CardCover>
                    <div className='cardContent'>
                        <div className='avatarDiv' style={bigVideoStyling.cardContentAvatarStyling}>
                            <Avatar alt={globalState.name} size="lg" />
                        </div>
                        <div className='userNameDiv' style={bigVideoStyling.cardContentUserNameStyling}>
                            {globalState.name}
                        </div>
                        <div className='micDiv' style={bigVideoStyling.cardContentMicStyling}>
                            <Avatar sx={{ background: '#3E4044', color: 'white' }} alt={'Mic'} size="sm" >{globalState.Mic ? <IoMdMic /> : <IoMdMicOff />}</Avatar>
                        </div>
                    </div>
                </Card>}
        </Wrapper>

    );
}

export default DualVideoCards;

const Wrapper = styled.div`
position:absolute;
inset: 16px 16px;
box-sizing:border-box;
display:grid;
justify-items: center;
align-items: center;



`;
