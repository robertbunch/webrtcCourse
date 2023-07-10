import moment from 'moment'
import { useEffect, useState } from 'react'

const CallInfo = ({apptInfo})=>{

    const [ momentText, setMomentText ] = useState(moment(apptInfo.apptDate).fromNow())
    
    useEffect(() => {
        const timeInterval = setInterval(()=>{
            setMomentText(moment(apptInfo.apptDate).fromNow())
            // console.log("Updating time")
        },5000)
        //clean up function
        return () => {
            // console.log("Clearing")
          clearInterval(timeInterval);
        };
      }, []);

    return(
        <div className="call-info">
            <h1>
                {apptInfo.professionalsFullName} has been notified.<br />
                Your appointment is {momentText}.
            </h1>
        </div>
    )
}

export default CallInfo