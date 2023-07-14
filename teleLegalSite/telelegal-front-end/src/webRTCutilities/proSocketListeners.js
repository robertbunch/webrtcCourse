
const proSocketListeners = (socket,setApptInfo)=>{
    socket.on('apptData',apptData=>{
        console.log(apptData)
        setApptInfo(apptData)
    })
}

export default proSocketListeners
