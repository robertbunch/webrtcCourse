import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import ActionButtonCaretDropDown from "../ActionButtonCaretDropDown";
import getDevices from "../VideoButton/getDevices";
import updateCallStatus from "../../redux-elements/actions/updateCallStatus";
import addStream from "../../redux-elements/actions/addStream";

const AudioButton = ({smallFeedEl})=>{

    const dispatch = useDispatch()
    const callStatus = useSelector(state=>state.callStatus);
    const [ caretOpen, setCaretOpen ] = useState(false);
    const [ audioDeviceList, setAudioDeviceList ] = useState([]);

    let micText;
    if(callStatus.current === "idle"){
        micText = "Join Audio"
    }else if(callStatus.audio){
        micText = "Mute"
    }else{
        micText = "Unmute"
    }

    useEffect(()=>{
        const getDevicesAsync = async()=>{
            if(caretOpen){
                //then we need to check for audio devices
                const devices = await getDevices();
                console.log(devices.videoDevices)
                setAudioDeviceList(devices.audioOutputDevices.concat(devices.audioInputDevices))
            }
        }
        getDevicesAsync()
    },[caretOpen])

    const changeAudioDevice = async(e)=>{
        //the user changed the desired ouput audio device OR input audio device
        //1. we need to get that deviceId AND the type
        const deviceId = e.target.value.slice(5);
        const audioType = e.target.value.slice(0,5);
        
        if(audioType === "output"){
            //4 (sort of out of order). update the smallFeedEl
            //we are now DONE! We dont care about the output for any other reason
            smallFeedEl.current.setSinkId(deviceId);
        }else if(audioType === "input"){
            //2. we need to getUserMedia (permission) 
            const newConstraints = {
                audio: {deviceId: {exact: deviceId}},
                video: callStatus.videoDevice === "default" ? true : {deviceId: {exact: callStatus.videoDevice}},
            }
            const stream = await navigator.mediaDevices.getUserMedia(newConstraints)
            //3. update Redux with that videoDevice, and that video is enabled
            dispatch(updateCallStatus('audioDevice',deviceId));
            dispatch(updateCallStatus('audio','enabled'))
            //5. we need to update the localStream in streams
            dispatch(addStream('localStream',stream))
            //6. add tracks
            const tracks = stream.getAudioTracks();
            //come back to this later
        }
    }

    return(
        <div className="button-wrapper d-inline-block">
            <i className="fa fa-caret-up choose-audio" onClick={()=>setCaretOpen(!caretOpen)}></i>
            <div className="button mic">
                <i className="fa fa-microphone"></i>
                <div className="btn-text">{micText}</div>
            </div>
            {caretOpen ? <ActionButtonCaretDropDown 
                            defaultValue={callStatus.audioDevice} 
                            changeHandler={changeAudioDevice}
                            deviceList={audioDeviceList}
                            type="audio"
                        /> : <></>}
        </div>        
    )
}

export default AudioButton