
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

document.querySelector('#share').addEventListener('click',e=>getMicAndCamera(e))