

import SockJS from "sockjs-client";
import Stomp from "stompjs";

let stompClient;

export const initializeStompClient = async () => {
  return new Promise((resolve, reject) => {
    try {
      // Initialize the SockJS WebSocket connection
      let socket = new SockJS("/ws");
      stompClient = Stomp.over(socket);
      // Connect to the WebSocket server
      stompClient.connect({}, (response) => {
        resolve(response);
      });
    } catch (error) {
      reject(error);
      console.error("Could not connect to WebSocket server.");
    }
  });
};

export const disconnectStompClient = () => {
  // Disconnect the Stomp client
  if (stompClient) {
    stompClient.disconnect();
    stompClient = null;
  }
};

export const getStompClient = () => {
  return stompClient;
};
