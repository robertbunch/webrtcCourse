import { io } from 'socket.io-client';

const socket = io.connect('https://localhost:9000');

export default socket;