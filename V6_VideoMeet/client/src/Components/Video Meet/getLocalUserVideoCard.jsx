import { useState, useEffect, useRef } from 'react';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import styled from 'styled-components';
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import Avatar from '@mui/joy/Avatar';

const LocalUserVideoCard = ({ localName, showVideo, playAudio, setMediaStream }) => {
    const localVideoRef = useRef(null);
    const [localMediaStream, setLocalMediaStream] = useState(null);

    const initializeMediaStream = async () => {
        try {  
               const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: 720,
                        height: 480,
                    },
                    audio: false,
                })
                
                localVideoRef.current.srcObject = stream;
                setMediaStream(stream.getVideoTracks()[0]);
                setLocalMediaStream(stream);

        } catch (err) {
            console.log("Error accessing media devices: ", err);
        }
    };

    useEffect(() => {
        initializeMediaStream();
        return () => {
            if (localMediaStream) {
                localMediaStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        if (!showVideo) {

            if (localMediaStream) {
                localMediaStream.getTracks().forEach(track => track.stop());
                setMediaStream(localMediaStream.getVideoTracks()[0]);
                setLocalMediaStream(null); // Reset localMediaStream state
            }
        } else {
            initializeMediaStream();
        }
    }, [showVideo]);

    const smallVideoStyling = {
        cardStyling: { minWidth: '234px', width: '234px', minHeight: '132px', height: '132px', background: !showVideo ? '#4A4E51' : 'none' },
        cardCoverStyling: { display: !showVideo ? 'none' : null },
    };

    return (
        <Wrapper>
            <Card className='smallVideoMainCard' component="li" sx={smallVideoStyling.cardStyling}>
                <CardCover sx={smallVideoStyling.cardCoverStyling}>
                    <video ref={localVideoRef} className='localVideo' autoPlay loop muted />
                </CardCover>
                <div className='cardContent' style={{ height: '100%', width: '100%' }}>
                    <div className='micDiv'>
                        <Avatar sx={{ background: '#3E4044', color: 'white' }} color='white' alt={'Mic'} size="sm" >
                            {playAudio ? <IoMdMic /> : <IoMdMicOff />}
                        </Avatar>
                    </div>
                    <div className='avatarDiv'>
                        <Avatar alt={`${localName}`} size="md" />
                    </div>
                    <div className='userNameDiv' >
                        {localName}
                    </div>
                </div>
            </Card>
        </Wrapper>
    );
};

export default LocalUserVideoCard;

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

    .cardContent {
        display: grid;
        place-items: center;

        .micDiv {
            justify-self: end;
        }
        .avatarDiv {
            justify-self: center;
        }
        .userNameDiv {
            justify-self: start;
            color: white;
            z-index: 1;
        }
    }
`;
