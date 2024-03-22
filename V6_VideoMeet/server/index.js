const express = require('express');
const socket = require('socket.io');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoute');

const app = express();
const server = app.listen(3000, () => {
    console.log("Server is running, http://localhost:3000/");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));

app.use('/', userRoutes);

const io = socket(server);

var existingConnections = [];

io.on("connection", (socket) => {

    socket.on("users_info_to_signaling_server", (incommingConnections)=>{
        const foundIncommingUserInExistingConnections = existingConnections
            .find(existingConnection => {
                return existingConnection.user_id == incommingConnections.current_user_name
                    && existingConnection.meeting_id == incommingConnections.meeting_id
            })
        var currentMeetingUsers = existingConnections.filter(existingConnection => {
            return existingConnection.user_id != incommingConnections.current_user_name
                && existingConnection.meeting_id == incommingConnections.meeting_id
        });
        if (foundIncommingUserInExistingConnections) {
            socket.emit("newConnectionInformation", currentMeetingUsers);
            return;
        }
        existingConnections.push({
            connectionId: socket.id,
            user_id: incommingConnections.current_user_name,
            meeting_id: incommingConnections.meeting_id,
        })
        console.log("incommingConnections data", incommingConnections)
        console.log(`all users ${existingConnections.map((u)=>u.connectionId)}`);
        console.log(`other users ${currentMeetingUsers.map((u)=>u.connectionId)}`);

        currentMeetingUsers.forEach(currentMeetingUser => {
            socket.to(currentMeetingUser.connectionId).emit('currentMeetingUsers_to_inform_about_new_connection_information', {
                newUserId: incommingConnections.current_user_name,
                newUserConnId: socket.id
            });
        });

        socket.emit("new_user_to_inform_about_currentMeetingUsers", currentMeetingUsers);
    });

    socket.on('sdpProcess', (data)=> {
        socket.to(data.to_connid).emit('sdpProcess', {
            message: data.message,
            from_connid: socket.id
        })
    })

    socket.on('disconnect', function(){
        var disconnectedUser = existingConnections.find(existingConnection => existingConnection.connectionId == socket.id);
        if(disconnectedUser){
            var meetingId = disconnectedUser.meeting_id;
            existingConnections = existingConnections.filter(existingConnection => existingConnection.connectionId != socket.id);
            var restUsers = existingConnections.filter(existingConnection => existingConnection.meeting_id == meetingId);
            restUsers.forEach(restUser =>{
                socket.to(restUser.connectionId).emit('closedConnectionInfo', socket.id);
            })

        }
    })

});



