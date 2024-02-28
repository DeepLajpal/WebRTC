import express from 'express';
import {createServer} from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {Server} from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url))
app.use(express.static(join(__dirname, '../client')));

//listening on socket Connection
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    })
    let isCallInitiated = false; // Keep track of whether a call is already initiated

    socket.on('offer', (msg) => {
      socket.broadcast.emit('offer', msg);
      if (!isCallInitiated) { // Only emit 'confirm' event if a call is not already initiated
        socket.broadcast.emit("confirm"); // Emit a 'confirm' event
        isCallInitiated = true; // Update the flag to indicate that a call is initiated
      }
    });
    socket.on('ans', (msg) => {
      socket.broadcast.emit('ans', msg);
    });
    socket.on('success', ()=>{
      socket.broadcast.emit('success', 'Connected! Press OK to continue...')
    })
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
  });
