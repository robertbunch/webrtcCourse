

const shareScreen = async()=>{

    const options = {
        video: true,
        audio: false,
        surfaceSwitching: 'include', //include/exclude NOT true/false
    }
    try{
        mediaStream = await navigator.mediaDevices.getDisplayMedia(options)
    }catch(err){
        console.log(err);
    }


    //we don't handle all button paths. To do so, you'd need
    //to check the DOM or use a UI framework.
    changeButtons([
        'green','green','blue','blue','green','green','green','green'
    ])
}