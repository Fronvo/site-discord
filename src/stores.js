import { writable } from 'svelte/store';
import { io } from 'socket.io-client';
import parser from 'socket.io-msgpack-parser';

// to show up error messages if it takes this long to connect
export const connectionTimeoutDuration = 5000;

// use 'socket' var name in other files, dont reserve
export const sockt = writable();

// replace with ws://localhost:3001 if hosting locally
const tempSocket = io('wss://fronvosrv.herokuapp.com', {
    // only websocket transport, no http polling
    transports: ['websocket'],
    path: '/fronvo',
    parser: parser
});

tempSocket.on('connect', () => {
    // no offline packets, may overflow after reconnection
    tempSocket.sendBuffer = [];
    sockt.set(tempSocket);
});

tempSocket.on('disconnect', () => {
    sockt.set(null);
});

// Profile
export let profileDict = writable({
    username: null,
    email: null,
    creationDate: null
});
