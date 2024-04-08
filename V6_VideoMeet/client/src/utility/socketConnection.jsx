import io from 'socket.io-client';

var socket;


const initSocket = async () => {
    return new Promise((resolve, reject) => {
        socket = io(import.meta.env.VITE_SOCKET_URL);
        console.log(`socket established`);

        socket.on('connect', () => {
            console.log('Connected to socket');
            if (socket.connected) {
                resolve(socket);
            }
        });

        socket.on('connect_error', (error) => {
            console.log('Socket connection error:', error);
            reject(error);
        });
    });
}

export const getSocket = () => {
    return socket;
};
export default initSocket;