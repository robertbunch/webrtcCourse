import { useState, useEffect } from "react";
import { useSelector } from "react-redux"
import ActionButtonCaretDropDown from "../ActionButtonCaretDropDown";
import getDevices from "../VideoButton/getDevices";

const AudioButton = ()=>{

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

    const changeAudioDevice = ()=>{

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