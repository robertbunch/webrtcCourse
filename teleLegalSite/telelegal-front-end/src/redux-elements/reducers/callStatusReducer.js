const initState = {
    current: "idle", //negotiating, progress, complete
    video: "off", //video feed status: "off" "enabled" "disabled" "complete"
    audio: "off", //audio is NOT on
    audioDevice: 'default', //enumerate devices, chosen audio device
    videoDevice: 'default',
    shareScreen: false, 
    haveMedia: false, //is there a localStream, has getUserMedia been run
}

export default (state = initState, action)=>{
    if (action.type === "UPDATE_CALL_STATUS"){
        const copyState = {...state}
        copyState[action.payload.prop] = action.payload.value
        return copyState
    }else if((action.type === "LOGOUT_ACTION") || (action.type === "NEW_VERSION")){
        return initState
    }else{
        return state
    }
}
