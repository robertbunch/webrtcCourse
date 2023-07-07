import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"
import axios from 'axios';
import './VideoComponents.css';
import CallInfo from "./CallInfo";
import ChatWindow from "./ChatWindow";
import ActionButtons from "./ActionButtons";
import addStream from '../redux-elements/actions/addStream';
import { useDispatch } from "react-redux";
import createPeerConnection from "../utilities/createPeerConnection";

const MainVideoPage = ()=>{

    //get query string finder hook 
    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ apptInfo, setApptInfo ] = useState({})
    const dispatch = useDispatch();
    
    useEffect(()=>{
        //fetch the user media
        const fetchMedia = async()=>{
            const constraints = {
                video: true, //must have one constraint, just dont show it yet
                audio: false,
            }
            try{
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                //dispatch will send this function to the redux dispatcher so all reducers are notified
                //we send 2 args, the who, and the stream
                dispatch(addStream('localStream',stream));
                const { peerConnection, remoteStream } = await createPeerConnection();
                //we don't know "who" we are talking to... yet.
                dispatch(addStream('remote1',remoteStream, peerConnection));
                //we have a peerconnection... let's make an offer!
                const offer = await peerConnection.createOffer();
                peerConnection.setLocalDescription(offer);
                //socket.emit the offer!
            }catch(err){
                console.log(err);
            }
        }
        fetchMedia()
    },[])

    useEffect(()=>{
        //grab the token var out of the query string
        const token = searchParams.get('token');
        console.log(token)
        const fetchDecodedToken = async()=>{
            const resp = await axios.post('https://localhost:9000/validate-link',{token});
            console.log(resp.data);
            setApptInfo(resp.data)
        }
        fetchDecodedToken();
    },[])

    return(
        <div className="main-video-page">
            <div className="video-chat-wrapper">
                {/* Div to hold our remote video, our local video, and our chat window*/}
                <video id="large-feed" autoPlay controls playsInline></video>
                <video id="own-feed" autoPlay controls playsInline></video>
                {apptInfo.professionalsFullName ? <CallInfo apptInfo={apptInfo} /> : <></>}
                <ChatWindow />
            </div>
            <ActionButtons />
        </div>
    )
}

export default MainVideoPage