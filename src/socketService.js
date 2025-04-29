import { io } from "socket.io-client";

// Set your backend URL here
const SOCKET_URL = "http://localhost:5000";  // Replace with your server's URL
const socket = io(SOCKET_URL, {
    withCredentials: true,
    transports: ["websocket"],  // Optional, ensures WebSocket transport is used
});

export const setupSocket = () => {
    // Any connection or event listeners you want to set up
    socket.on('connect', () => {
        console.log('Connected to Socket.IO server');
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from Socket.IO server');
    });

    // You can also listen for custom events
    socket.on('yourCustomEvent', (data) => {
        console.log('Received data from server:', data);
    });

    return socket;
};

export default socket;