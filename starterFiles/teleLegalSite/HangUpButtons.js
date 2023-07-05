import { useDispatch, useSelector } from "react-redux"
import updateCallStatus from "../redux-elements/actions/updateCallStatus"

const HangupButton = ()=>{

    const dispatch = useDispatch()
    const callStatus = useSelector(state=>state.callStatus)

    const hangupCall = ()=>{
        dispatch(updateCallStatus('current','complete'))
    }

    if(callStatus.current === "complete"){
        return <></>
    }

    return(
        <button 
            onClick={hangupCall} 
            className="btn btn-danger hang-up"
        >Hang Up</button>
    )
}

export default HangupButton
