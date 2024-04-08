import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Popup = styled.div`
  display: ${({ open }) => (open ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const PopupContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 800px;
  max-width: calc(100% - 40px);
  max-height: calc(100% - 40px);
  overflow: auto;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
`;

const VideoContainer = styled.div`
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
`;

const LocalVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const InputFields = styled.div`
  label {
    display: block;
    margin-bottom: 5px;
  }

  select {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
`;

function GetLocalUserMedia({handleJoinMeet}) {
  const [open, setOpen] = useState(false);
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState('');
  const [selectedAudioDevice, setSelectedAudioDevice] = useState('');
  const [mediaStream, setMediaStream] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    // Fetch video and audio devices when the component mounts
    fetchMediaDevices();
  }, []);

  const fetchMediaDevices = () => {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const videoDevicesList = devices.filter(device => device.kind === 'videoinput');
        const audioDevicesList = devices.filter(device => device.kind === 'audioinput');
        setVideoDevices(videoDevicesList);
        setAudioDevices(audioDevicesList);
      })
      .catch(err => console.error('Error accessing media devices:', err));
  };

  const openPopup = () => {
    setOpen(true);
    // Get default media streams when opening the popup
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
        setMediaStream(stream);
        fetchMediaDevices(); // Update media devices
      })
      .catch(err => console.error('Error accessing default media stream:', err));
  };

  const closePopup = () => {
    setOpen(false);
    // Stop the media stream when closing the popup
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
  };

  const handleVideoDeviceChange = (event) => {
    setSelectedVideoDevice(event.target.value);
    // Update video stream
    navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: event.target.value } } })
      .then(stream => {
        videoRef.current.srcObject = stream;
      })
      .catch(err => console.error('Error accessing new video stream:', err));
  };

  const handleAudioDeviceChange = (event) => {
    setSelectedAudioDevice(event.target.value);
    // Update audio stream
    navigator.mediaDevices.getUserMedia({ audio: { deviceId: { exact: event.target.value } } })
      .then(stream => {
        const newStream = new MediaStream([...videoRef.current.srcObject.getVideoTracks(), ...stream.getAudioTracks()]);
        videoRef.current.srcObject = newStream;
      })
      .catch(err => console.error('Error accessing new audio stream:', err));
  };

  return (
    <>
      <button id="openPopupBtn" onClick={openPopup}>Select Device</button>
      <Popup open={open}>
        <PopupContent>
          <VideoContainer>
            <LocalVideo ref={videoRef} autoPlay muted></LocalVideo>
          </VideoContainer>
          <InputFields>
            <label htmlFor="audioDevice">Select Audio Device:</label>
            <select id="audioDevice" onChange={handleAudioDeviceChange} value={selectedAudioDevice}>
              {audioDevices.map(device => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Microphone ${audioDevices.indexOf(device) + 1}`}
                </option>
              ))}
            </select>
            <label htmlFor="videoDevice">Select Video Device:</label>
            <select id="videoDevice" onChange={handleVideoDeviceChange} value={selectedVideoDevice}>
              {videoDevices.map(device => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${videoDevices.indexOf(device) + 1}`}
                </option>
              ))}
            </select>
          </InputFields>
          <button onClick={closePopup} disabled={!mediaStream}>Close</button>
          <button onClick={handleJoinMeet} disabled={!mediaStream}>Click Me! to Join!</button>
        </PopupContent>
      </Popup>
    </>
  );
}

export default GetLocalUserMedia;
