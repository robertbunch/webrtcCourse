import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import ActionButtonCaretDropDown from "../ActionButtonCaretDropDown";
import getDevices from "../VideoButton/getDevices";
import updateCallStatus from "../../redux-elements/actions/updateCallStatus";
import addStream from "../../redux-elements/actions/addStream";
import startAudioStream from "./startAudioStream";

const AudioButton = ({smallFeedEl})=>{

    const dispatch = useDispatch()
    const callStatus = useSelector(state=>state.callStatus);
    const streams = useSelector(state=>state.streams);
    const [ caretOpen, setCaretOpen ] = useState(false);
    const [ audioDeviceList, setAudioDeviceList ] = useState([]);

    let micText;
    if(callStatus.audio === "off"){
        micText = "Join Audio"
    }else if(callStatus.audio === "enabled"){
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

    const startStopAudio = ()=>{
        //first, check if the audio is enabled, if so disabled
        if(callStatus.audio === "enabled"){
            //update redux callStatus
            dispatch(updateCallStatus('audio',"disabled"));
            //set the stream to disabled
            const tracks = streams.localStream.stream.getAudioTracks();
            tracks.forEach(t=>t.enabled = false);
        }else if(callStatus.audio === "disabled"){
        //second, check if the audio is disabled, if so enable
            //update redux callStatus
            dispatch(updateCallStatus('audio',"enabled"));
            const tracks = streams.localStream.stream.getAudioTracks();
            tracks.forEach(t=>t.enabled = true);
        }else{
            //audio is "off" What do we do?
            changeAudioDevice({target:{value:"inputdefault"}})
            //add the tracks 
            startAudioStream(streams);
        }
    }

    const changeAudioDevice = async(e)=>{
        //the user changed the desired ouput audio device OR input audio device
        //1. we need to get that deviceId AND the type
        const deviceId = e.target.value.slice(5);
        const audioType = e.target.value.slice(0,5);
        console.log(e.target.value)
        
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
            //6. add tracks - actually replaceTracks
            const [audioTrack] = stream.getAudioTracks();
            //come back to this later

            for(const s in streams){
                if(s !== "localStream"){
                    //getSenders will grab all the RTCRtpSenders that the PC has
                    //RTCRtpSender manages how tracks are sent via the PC
                    const senders = streams[s].peerConnection.getSenders();
                    //find the sender that is in charge of the video track
                    const sender = senders.find(s=>{
                        if(s.track){
                            //if this track matches the videoTrack kind, return it
                            return s.track.kind === audioTrack.kind
                        }else{
                            return false;
                        }
                    })
                    //sender is RTCRtpSender, so it can replace the track
                    sender.replaceTrack(audioTrack)
                }
            }

        }
    }

    return(
        <div className="button-wrapper d-inline-block">
            <i className="fa fa-caret-up choose-audio" onClick={()=>setCaretOpen(!caretOpen)}></i>
            <div className="button mic" onClick={startStopAudio}>
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