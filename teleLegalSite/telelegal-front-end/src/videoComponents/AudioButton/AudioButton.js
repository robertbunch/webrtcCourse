import { useSelector } from "react-redux"

const AudioButton = ()=>{

    const callStatus = useSelector(state=>state.callStatus);

    let micText;
    if(callStatus.current === "idle"){
        micText = "Join Audio"
    }else if(callStatus.audio){
        micText = "Mute"
    }else{
        micText = "Unmute"
    }

    return(
        <div className="button-wrapper d-inline-block">
            <i className="fa fa-caret-up choose-audio"></i>
            <div className="button mic">
                <i className="fa fa-microphone"></i>
                <div className="btn-text">{micText}</div>
            </div>
        </div>        
    )
}

export default AudioButton