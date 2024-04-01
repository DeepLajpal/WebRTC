import React, { useState, useEffect, useRef } from 'react';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import styled from 'styled-components';
import { useGlobalState } from '../../ContextAPI/GlobalStateContext';
import { IoMdMic } from "react-icons/io";
import { IoMdMicOff } from "react-icons/io";
import Avatar from '@mui/joy/Avatar';
let rtpVideoSenders =[];
let vStream;

const MultiUsersCard = ({ localName, localMeetingId, existingUsersData }) => {

    const { globalState } = useGlobalState();
    var localVideoRef = useRef(null);


        // Function to update media senders
    function updateMediaSenders(track, rtpSenders) {
        for (var con_id in users_connection) {
            var connection = users_connection[con_id];
            if (
                connection &&
                (connection.connectionState == "new" ||
                    connection.connectionState == "connecting" ||
                    connection.connectionState == "connected")
            ) {
                if (rtpSenders[con_id] && rtpSenders[con_id].track) {
                    rtpSenders[con_id].replaceTrack(track);
                } else {
                    rtpSenders[con_id] = users_connection[con_id].addTrack(track);
                }
            }
        }
    }


    async function processMedia() {
        try {
            vStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: 720,
                    height: 480,
                },
                audio: false,
            });

            const mediaTrack = vStream.getVideoTracks()[0];
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = new MediaStream([mediaTrack]);
                // updateMediaSenders(mediaTrack, rtpVideoSenders);
            } else {
                console.log('Local Video Ref is not available');
            }
        } catch (err) {
            console.log("Error on processing media: ", err);
        }
    }

    useEffect(() => {
        processMedia();
        return () => {
            vStream.getTracks().forEach(track => track.stop());
        };
    }, []);

    useEffect(() => {
            if (!globalState.Video) {
                vStream.getTracks().forEach(track => track.stop())
                console.log('Video Stopped');
            } else {
                processMedia();
                console.log('Video Started');
            }
    }, [globalState.Video]);




    const smallVideoStyling = {
        cardStyling: { minWidth: '234px', width: '234px', minHeight: '132px', height: '132px', background: !globalState.Video ? '#4A4E51' : 'none' },
        cardCoverStyling: { display: !globalState.Video ? 'none' : null },
    }

    return (
        <Wrapper>
            <Card className='smallVideoMainCard' component="li" sx={smallVideoStyling.cardStyling}>
                <CardCover sx={smallVideoStyling.cardCoverStyling}>
                    <video ref={localVideoRef} className='localVideo'
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
                        <Avatar alt={`${localName}`} size="md" />
                    </div>
                    <div className='userNameDiv' >
                        {localName}
                    </div>
                </div>
            </Card>
            {existingUsersData.map((user, index) => {

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
                            <Avatar alt={user?.user_id} size="md" />
                        </div>
                        <div className='userNameDiv' >
                            {user?.user_id}
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
