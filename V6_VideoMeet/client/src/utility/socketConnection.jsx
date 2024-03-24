
import io from 'socket.io-client';

let socket;

export const initSocket = (username, meeting_id) => {
    return new Promise((resolve, reject) => {
        const socket = io(import.meta.env.VITE_SOCKET_URL);

        socket.on('connect', () => {
            console.log('Connected to socket');
            if (socket.connected) {
                // Send user info to signaling server
                socket.emit("users_info_to_signaling_server", {
                    current_user_name: username,
                    meeting_id: meeting_id,
                });
            }
            resolve(socket);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from socket');
            // Additional logic or event listeners can be added here
        });

        socket.on('connect_error', (error) => {
            console.error('Error connecting to socket:', error);
            reject(error);
        });
    })
};

export const getSocket = () => {
    return socket;
};