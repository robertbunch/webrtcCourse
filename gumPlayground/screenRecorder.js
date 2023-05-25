let mediaRecorder;
let recordedBlobs;

const startRecording = ()=>{
    if(!stream){ //you could use mediaStream!
        alert("No current feed");
        return
    }
    console.log("Start recording")
    recordedBlobs = []; // an array to hold the blobs for playback
    //you could use mediaStream to record!
    mediaRecorder = new MediaRecorder(stream) //make a mediaRecorder from the constructor
    mediaRecorder.ondataavailable = e=>{
        //ondataavailable will run when the stream ends, or stopped, or we specifically ask for it
        console.log("Data is available for the media recorder!")
        recordedBlobs.push(e.data)
    }
    mediaRecorder.start();
    changeButtons([
        'green','green','blue','blue','green','blue','grey','blue'
    ])
}


const stopRecording = ()=>{
    if(!mediaRecorder){
        alert("Please record before stopping!")
        return
    }
    console.log("stop recording")
    mediaRecorder.stop()
    changeButtons([
        'green','green','blue','blue','green','green','blue','blue'
    ])

}

const playRecording = ()=>{
    console.log("play recording")
    if(!recordedBlobs){
        alert("No Recording saved")
        return
    }
    const superBuffer = new Blob(recordedBlobs) // superBuffer is a super buffer of our array of blobs
    const recordedVideoEl = document.querySelector('#other-video');
    recordedVideoEl.src = window.URL.createObjectURL(superBuffer);
    recordedVideoEl.controls = true;
    recordedVideoEl.play();
    changeButtons([
        'green','green','blue','blue','green','green','green','blue'
    ])
}
