import React, { useState, useEffect, useRef } from 'react';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import styled from 'styled-components';
import { IoMdMic } from "react-icons/io";
import { IoMdMicOff } from "react-icons/io";
import Avatar from '@mui/joy/Avatar';
let vStream;

const MultiUsersCard = ({ localName, localMeetingId, showVideo, playAudio, existingUsersData, updateMediaSenders, rtpVideoSenders, remoteVideosRef, setRemoteVideoRef, mediaTrack, setMediaTrack }) => {

    var localVideoRef = useRef(null);
   

    async function processMedia() {
        try {
            vStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: 720,
                    height: 480,
                },
                audio: false,
            });

            mediaTrack = vStream.getVideoTracks()[0];
            setMediaTrack(mediaTrack);
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = new MediaStream([mediaTrack]);
                updateMediaSenders(mediaTrack, rtpVideoSenders);
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
            if (!showVideo) {
                vStream.getTracks().forEach(track => track.stop())
                console.log('Video Stopped');
            } else {
                processMedia();
                console.log('Video Started');
            }
    }, [showVideo]);




    const smallVideoStyling = {
        cardStyling: { minWidth: '234px', width: '234px', minHeight: '132px', height: '132px', background: !showVideo ? '#4A4E51' : 'none' },
        cardCoverStyling: { display: !showVideo ? 'none' : null },
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
                        <Avatar sx={{ background: '#3E4044', color: 'white' }} color='white' alt={'Mic'} size="sm" >{playAudio ? <IoMdMic /> : <IoMdMicOff />}</Avatar>
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
                        <video 
                        // ref={remoteVideosRef.current[user.connectionId]}
                        ref={ref => {
                            remoteVideosRef.current[user.connectionId] = ref; // Set reference using connectionId
                            if (typeof setRemoteVideoRef === 'function') {
                              setRemoteVideoRef(user.connectionId, ref); // Call the callback function with connectionId
                            }
                          }} 
                            autoPlay
                            loop
                            muted
                        >
                        </video>
                    </CardCover>
                    <div className='cardContent' style={{ height: '100%', width: '100%' }}>
                        <div className='micDiv'>
                            <Avatar sx={{ background: '#3E4044', color: 'white' }} color='white' alt={'Mic'} size="sm" >{playAudio ? <IoMdMic /> : <IoMdMicOff />}</Avatar>
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
