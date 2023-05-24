let mediaRecorder;
let recordedBlobs;

const startRecording = ()=>{
    console.log("Start recording")
    recordedBlobs = []; // an array to hold the blobs for playback
    mediaRecorder = new MediaRecorder(stream) //make a mediaRecorder from the constructor
    mediaRecorder.ondataavailable = e=>{
        //ondataavailable will run when the stream ends, or stopped, or we specifically ask for it
        console.log("Data is available for the media recorder!")
        recordedBlobs.push(e.data)
    }
    mediaRecorder.start();
}


const stopRecording = ()=>{
    console.log("stop recording")
    mediaRecorder.stop()
}

const playRecording = ()=>{
    console.log("play recording")
    const superBuffer = new Blob(recordedBlobs) // superBuffer is a super buffer of our array of blobs
    const recordedVideoEl = document.querySelector('#other-video');
    recordedVideoEl.src = window.URL.createObjectURL(superBuffer);
    recordedVideoEl.controls = true;
    recordedVideoEl.play();
}
