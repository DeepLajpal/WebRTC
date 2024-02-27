const peerConnection = new RTCPeerConnection();
let localStream;
let remoteStream;
const socket = io();

const init = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
  const localVideo = document.querySelector(".user-1-stream");
  localVideo.srcObject = localStream;
  
  localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream)
    }); 
    
    peerConnection.ontrack = (e) => {
    remoteStream = new MediaStream;
    console.log(e);
    document.querySelector(".user-2-stream").srcObject = remoteStream
    console.log("inside ontrack")
      remoteStream.addTrack(e.track);
      console.log(remoteStream);
  }
};

const createOffer = async () => {

    // onicecandidate event trigger when the the offer is created
    peerConnection.onicecandidate = (e) => {
        document.querySelector(".sdp-offer-input").value = JSON.stringify(peerConnection.localDescription);
        socket.emit("offer", JSON.stringify(peerConnection.localDescription));
    }
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer)
    console.log(offer);

}
let offer;
let ans;
socket.on("offer", (sdp) => {
  // console.log("inside socket offer sdp: ", sdp)
  offer = sdp;
});
socket.on("ans", (sdp) => {
  console.log("inside socket ans sdp: ", sdp)
  ans = sdp;
});

const createAnswer = async () => {
  // const offer = document.querySelector(".sdp-offer-input").value;

  peerConnection.onicecandidate = (e) => {
    document.querySelector(".sdp-ans-input").value = JSON.stringify(peerConnection.localDescription);
    socket.emit("ans", JSON.stringify(peerConnection.localDescription));
  }
  await peerConnection.setRemoteDescription(JSON.parse(offer));
  const ans = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(ans);
}

const addAnswer = async () => {
  console.log()
  // const ans = document.querySelector(".sdp-ans-input").value;
  await peerConnection.setRemoteDescription(JSON.parse(ans));
  console.log("Connection Established Successfully")
}


init();
document.querySelector(".create-offer-btn").addEventListener("click", createOffer);
document.querySelector(".create-ans-btn").addEventListener("click", createAnswer);
document.querySelector(".add-ans-btn").addEventListener("click", addAnswer);