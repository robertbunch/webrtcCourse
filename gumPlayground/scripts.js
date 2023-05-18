const videoEl = document.querySelector('#my-video');
let stream = null // Init stream var so we can use anywhere
const constraints = {
    audio: true, //use your headphones, or be prepared for feedback!
    video: true,
}


const getMicAndCamera = async(e)=>{

    try{
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log(stream)
    }catch{
        //user denied access to constraints
        console.log("user denied access to constraints")
    }
};

const showMyFeed = e=>{
    console.log("showMyFeed is working")
    videoEl.srcObject = stream; // this will set our MediaStream (stream) to our <video />
    const tracks = stream.getTracks();
    console.log(tracks);
}
const stopMyFeed = e=>{
    const tracks = stream.getTracks();
    tracks.forEach(track=>{
        // console.log(track)
        track.stop(); //disassociates the track with the source
    })
}

document.querySelector('#share').addEventListener('click',e=>getMicAndCamera(e))
document.querySelector('#show-video').addEventListener('click',e=>showMyFeed(e))
document.querySelector('#stop-video').addEventListener('click',e=>stopMyFeed(e))