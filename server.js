var express = require('express');
const { env } = require('process');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const linkPreview = require('./utils/linkPreview');
//require for file serve
var fs = require('fs');
const { isObject } = require('util');

const formatedMessage = require('./utils/message');
const formatedMessageLink = require('./utils/message');
// const Chat = require('./models/Chat');
// const connect = require('./dbconnection');

const port = process.env.port || 5000;
var users = [];
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
  })
  
var pattern = new RegExp('([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?([^ ])+');

io.on('connection',(socket)=>{
    //show conncted user
    socket.on('user-connected',(username)=>{
        console.log('id : '+socket.id+' with name '+username +' is connected to socket');
        users[username] = socket.id;
        socket.broadcast.emit('user_connected',username);
    });

    socket.on('message',(data)=>{
        var socketId = users[data.receiver];
        console.log(data);
        if(urlValidation(data.message)){
            var urlData;
            //var urlData = linkPreview.startDiscover(pattern.exec(message)[0]);
            linkPreview.startDiscover(pattern.exec(data.message)[0],function(results){
                urlData = results;
                console.log('This is url data: ',urlData);
                io.to(socketId).emit('new_message',formatedMessageLink(data.sender,data.receiver,urlData));    
            });
            

        }
        else
        {
            io.to(socketId).emit('new_message', formatedMessage(data.sender,data.receiver,data.message));
        }
    });
    //test
    // socket.on('room',(room)=>{
    //     //console.log('My Room:'+socket.id);
    //     //console.log('Connected room :'+room);
    //     socket.join(room);
    //     io.sockets.in(room).emit('test_message','Hi',room);
    // });

    
    socket.on('image',(msg)=>{
        console.log(msg);
        var socketId = users[msg.receiver];
        socket.to(socketId).emit('userimage', msg);
    });

    //show user typing
    socket.on('typing',(msg)=>{
        socket.broadcast.emit('typing',msg);
    });

    socket.on('stoptyping',(msg)=>{
        socket.broadcast.emit('stoptyping',msg);
    });
    //check user disconnect
    socket.on('disconnecting',()=>{
        console.log(socket.id+' left the chat');
    });
});

// connect.then(db=>{
//     console.log("connected correctly to the database");
// });

http.listen(port,()=>{
    console.log(`Lisetening on port ${port}`);
});

var urlValidation = (url) => {
    return pattern.test(url);
}