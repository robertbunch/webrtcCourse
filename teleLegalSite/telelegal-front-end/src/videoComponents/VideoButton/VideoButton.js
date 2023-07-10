import { useSelector } from "react-redux";

const VideoButton = ()=>{

    const callStatus = useSelector(state=>state.callStatus)
    
    return(
        <div className="button-wrapper video-button d-inline-block">
            <i className="fa fa-caret-up choose-video"></i>
            <div className="button camera">
                <i className="fa fa-video"></i>
                <div className="btn-text">{callStatus.video === "display" ? "Stop" : "Start"} Video</div>
            </div>
        </div>
    )
}
export default VideoButton;