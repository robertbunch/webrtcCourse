import { io } from 'socket.io-client';

const socketConnection = (jwt)=>{
    const socket = io.connect('https://localhost:9000',{
        auth: {
            jwt
        }
    });
}

export default socketConnection;