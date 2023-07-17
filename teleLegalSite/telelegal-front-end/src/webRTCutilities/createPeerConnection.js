import peerConfiguration from './stunServers'


const createPeerConnection = (addIce)=>{
    return new Promise(async(resolve, reject)=>{
        const peerConnection = await new RTCPeerConnection(peerConfiguration);
        //rtcPeerConnection is the connection to the peer.
        //we may need more than one this time!!
        //we pass it the config object, which is just stun servers
        //it will get us ICE candidates
        const remoteStream = new MediaStream();
        peerConnection.addEventListener('signalingstatechange',(e)=>{
            console.log("Signaling State Change")
            console.log(e)
        })
        peerConnection.addEventListener('icecandidate',e=>{
            console.log("Found ice candidate...")
            if(e.candidate){
                addIce(e.candidate)
            }
        })
        peerConnection.addEventListener('track',e=>{
            console.log("Got a track from the remote!")
            e.streams[0].getTracks().forEach(track=>{
                remoteStream.addTrack(track,remoteStream);
                console.log("Fingers crossed...")
            })
        })

        resolve({
            peerConnection,
            remoteStream,
        })
    })

}

export default createPeerConnection
