import peerConfiguration from './stunServers'


const createPeerConnection = ()=>{
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
        peerConnection.addEventListener('icecandidates',e=>{
            console.log("Found ice candidate...")
            if(e.candidate){
                //emit to socket server
            }
        })
        resolve({
            peerConnection,
            remoteStream,
        })
    })

}

export default createPeerConnection
