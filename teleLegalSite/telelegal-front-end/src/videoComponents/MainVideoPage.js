import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"
import axios from 'axios';
import './VideoComponents.css';
import CallInfo from "./CallInfo";
import ChatWindow from "./ChatWindow";
import ActionButtons from "./ActionButtons";

const MainVideoPage = ()=>{

    //get query string finder hook 
    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ apptInfo, setApptInfo ] = useState({})

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