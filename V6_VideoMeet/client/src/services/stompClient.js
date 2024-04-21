import SockJS from "sockjs-client";
import Stomp from "stompjs";

let stompClient = null;
const initializeStompClient = async () => {
  return new Promise((resolve, reject) => {
    try {
      let socket = new SockJS(
        import.meta.env.VITE_REACT_APP_PUBLIC_SOCKET_ENDPOINT
      );
      console.log(socket, "socket");
      stompClient = Stomp.over(socket);
      // connect to the server
      stompClient?.connect(
        {}, // headers
        (response) => {
          resolve(response);
        } // success callback
      );
    } catch (error) {
      reject(error);
      console.log(error, "Could not connect to WebSocket server.");
    }
  });
};

const disconnectStompClient = () => {
  if (stompClient) {
    stompClient.disconnect();
    stompClient = null;
  }
};

const getStompClient = () => {
  return stompClient;
};

export { initializeStompClient, getStompClient, disconnectStompClient };
