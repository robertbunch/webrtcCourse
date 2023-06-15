

const localVideoEl = document.querySelector('#local-video');
const remoteVideoEl = document.querySelector('#remote-video');

let localStream; //a var to hold the local video stream
let remoteStream; //a var to hold the remote video stream
let peerConnection; //the peerConnection that the two clients use to talk

//when a client initiates a call
const call = async e=>{
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        // audio: true,
    });
    localVideoEl.srcObject = stream;
}



document.querySelector('#call').addEventListener('click',call)