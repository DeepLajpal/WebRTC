import express from 'express';
import {createServer} from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
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
    socket.on('offer', (msg) => {
      io.emit('offer', msg);
    });
    socket.on('ans', (msg) => {
      io.emit('ans', msg);
    });
    socket.on('success', ()=>{
      io.emit('success', 'Connected! Press OK to continue...')
    })
  });


server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
  });