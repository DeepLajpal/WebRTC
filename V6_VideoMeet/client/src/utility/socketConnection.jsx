import io from 'socket.io-client';

var socket;


const initSocket = (username, meeting_id) => {
    socket = io(import.meta.env.VITE_SOCKET_URL);
    console.log(`socket established`);

    socket.on('connect', () => {
        console.log('Connected to socket');
        if (socket.connected) {
            // Send user info to signaling server
            socket.emit("users_info_to_signaling_server", {
                current_user_name: username,
                meeting_id: meeting_id,
            });
        }
    });

    return socket;
}

export const getSocket = () => {
    return socket;
};
export default initSocket;