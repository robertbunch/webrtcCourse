import { io } from 'socket.io-client';

let socket;
const socketConnection = (jwt)=>{
    //check to see if the socket is already connected
    if(socket && socket.connected){
        //if so, then just return it so whoever needs it, can use it
        return socket;
    }else{
        //its not connected... connect!
        socket = io.connect('https://api.deploying-javascript.com',{
            auth: {
                jwt
            }
        });
        return socket;
    }
}

export default socketConnection;