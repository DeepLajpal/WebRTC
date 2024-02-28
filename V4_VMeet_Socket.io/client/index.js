const localVideo = document.querySelector(".local-video");
const remoteVideo = document.querySelector(".remote-video");
const callUserBtn = document.querySelector(".call-user-btn");
const socket = io();
let offer;
let ans;
let ansReceived;

socket.on("offer", async (sdp) => {
    offer = sdp;
    await handleOffer();
});

socket.on("ans", async (sdp) => {
    ans = sdp;
    ansReceived = true;
    if (ansReceived) {
        await handleAnswer();
    }
});

socket.on('success', (successMsg) => {
    alert(successMsg);
});

socket.on('confirm', async () => {
    const alertResponse = confirm("Incoming call! Do you want to accept?");
    if (alertResponse) {
        await handleConfirm();
    }
});

const peerConnection = new RTCPeerConnection();
let localStream;
let remoteStream;

const init = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
    });
    localVideo.srcObject = localStream;
    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = (e) => {
        remoteStream = new MediaStream();
        remoteVideo.srcObject = remoteStream;
        remoteStream.addTrack(e.track);
    };
};

const callUser = async () => {
    peerConnection.onicecandidate = async (e) => {
        socket.emit("offer", JSON.stringify(peerConnection.localDescription));
        alert("Call Initiated, Waiting for the available user to accepts your call...");
    };
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
};

const handleOffer = async () => {
    await peerConnection.setRemoteDescription(JSON.parse(offer));
    const ans = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(ans);
};

const handleAnswer = async () => {
    await peerConnection.setRemoteDescription(JSON.parse(ans));
};

const handleConfirm = async () => {
    peerConnection.onicecandidate = async (e) => {
        socket.emit("ans", JSON.stringify(peerConnection.localDescription));
    };
    await handleOffer();
};

init();

callUserBtn.addEventListener("click", callUser);
