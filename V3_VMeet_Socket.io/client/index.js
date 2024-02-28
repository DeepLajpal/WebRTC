//videoElements
const localVideo = document.querySelector(".local-video");
const remoteVideo = document.querySelector(".remote-video");

//buttonElements
const createOfferBtn = document.querySelector(".create-offer-btn");
const createAnsBtn = document.querySelector(".create-ans-btn");
const addAnswerBtn = document.querySelector(".add-ans-btn");

//socket.io
const socket = io();
let offer;
let ans;
socket.on("offer", (sdp) => {
  offer = sdp;
});
socket.on("ans", (sdp) => {
  ans = sdp;
});
socket.on('success', (successMsg)=>{
  alert(successMsg);
})

//webrtc Specific variables
const peerConnection = new RTCPeerConnection();
let localStream;
let remoteStream;

const init = async () => {
  
  //localVideo
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });

  localVideo.srcObject = localStream;
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  //remoteVideo 
  peerConnection.ontrack = (e) => {
    remoteStream = new MediaStream();
    remoteVideo.srcObject = remoteStream;
    remoteStream.addTrack(e.track);
  };
};

const createOffer = async () => {
  //Note 1: onicecandidate event listener trigger when the offer is created
  peerConnection.onicecandidate = (e) => {
    socket.emit("offer", JSON.stringify(peerConnection.localDescription));
  };
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  //notifying user
  alert("offer created");
};

const createAnswer = async () => {
    //Note 2: onicecandidate event listener trigger when the ans is created
  peerConnection.onicecandidate = (e) => {
    socket.emit("ans", JSON.stringify(peerConnection.localDescription));
  };
  await peerConnection.setRemoteDescription(JSON.parse(offer));
  const ans = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(ans);

    //notifying user
    alert("answer created");
};

const addAnswer = async () => {
  console.log();
  await peerConnection.setRemoteDescription(JSON.parse(ans));
  socket.emit('success')
};

init();

createOfferBtn.addEventListener("click", createOffer);
createAnsBtn.addEventListener("click", createAnswer);
addAnswerBtn.addEventListener("click", addAnswer);
