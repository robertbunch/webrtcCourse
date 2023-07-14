import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom"
import axios from 'axios';
import './VideoComponents.css';
import CallInfo from "./CallInfo";
import ChatWindow from "./ChatWindow";
import ActionButtons from "./ActionButtons";
import addStream from '../redux-elements/actions/addStream';
import { useDispatch, useSelector } from "react-redux";
import createPeerConnection from "../webRTCutilities/createPeerConnection";
import socketConnection from '../webRTCutilities/socketConnection';
import updateCallStatus from "../redux-elements/actions/updateCallStatus";

const ProMainVideoPage = ()=>{

    const dispatch = useDispatch();
    const callStatus = useSelector(state=>state.callStatus)
    const streams = useSelector(state=>state.streams)
    //get query string finder hook 
    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ apptInfo, setApptInfo ] = useState({})
    const smallFeedEl = useRef(null); //this is a React ref to a dom element, so we can interact with it the React way
    const largeFeedEl = useRef(null);

    useEffect(()=>{
        //fetch the user media
        const fetchMedia = async()=>{
            const constraints = {
                video: true, //must have one constraint, just dont show it yet
                audio: true, //if you make a video chat app that doesnt use audio, but does (????), then init this as false, and add logic later ... hahaha
            }
            try{
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                dispatch(updateCallStatus('haveMedia',true)); //update our callStatus reducer to know that we have the media
                //dispatch will send this function to the redux dispatcher so all reducers are notified
                //we send 2 args, the who, and the stream
                dispatch(addStream('localStream',stream));
                const { peerConnection, remoteStream } = await createPeerConnection();
                //we don't know "who" we are talking to... yet.
                dispatch(addStream('remote1',remoteStream, peerConnection));
                //we have a peerconnection... let's make an offer!
                //EXCEPT, it's not time yet. 
                    //SDP = information about the feed, and we have NO tracks
                //socket.emit...
            }catch(err){
                console.log(err);
            }
        }
        fetchMedia()
    },[])

    useEffect(()=>{
        const setAsyncOffer = async()=>{
            for(const s in streams){
                if(s !== "localStream"){
                    const pc = streams[s].peerConnection;
                    await pc.setRemoteDescription(callStatus.offer)
                    console.log(pc.signalingstate); //should be have remote offer
                }
            }
        }
        if(callStatus.offer && streams.remote1 && streams.remote1.peerConnection){
            setAsyncOffer()
        }
    },[callStatus.offer,streams.remote1])

    useEffect(()=>{
        const createAnswerAsync = async()=>{
            //we have audio and video, we can make an answer and setLocalDescription
            for(const s in streams){
                if(s !== "localStream"){
                    const pc = streams[s].peerConnection;
                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);
                    console.log(pc.signalingState);//have local answer

                    
                    //emit the answer to the server
                }

            }
        }
        //we only create an answer if audio and video are enabled AND haveCreatedAnswer is false
        //this may run many times, but these 3 events will only happen one
        if(callStatus.audio === "enabled" && callStatus.video === "enabled" && !callStatus.haveCreatedAnswer){
            createAnswerAsync()
        }
    },[callStatus.audio, callStatus.video, callStatus.haveCreatedAnswer])


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
                <video id="large-feed" ref={largeFeedEl} autoPlay controls playsInline></video>
                <video id="own-feed" ref={smallFeedEl} autoPlay controls playsInline></video>
                {callStatus.audio === "off" || callStatus.video === "off" ?
                    <div className="call-info">
                        <h1>
                            {searchParams.get('client')} is in the waiting room.<br />
                            Call will start when video and audio are enabled
                        </h1>
                    </div> : <></>
                }
                <ChatWindow />
            </div>
            <ActionButtons smallFeedEl={smallFeedEl} />
        </div>
    )
}

export default ProMainVideoPage