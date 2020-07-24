var express = require('express');
const { env } = require('process');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
//require for file serve
var fs = require('fs');

// const Chat = require('./models/Chat');
// const connect = require('./dbconnection');

const port = process.env.port || 5000;

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
  })

io.on('connection',(socket)=>{
    //check user connected
    console.log(socket.client.id +' connected..');

    socket.on('message',(msg)=>{
        socket.broadcast.emit('message', msg);
    });

    socket.on('image',(msg)=>{
        socket.broadcast.emit('userimage', msg);
    });

    //show user typing
    socket.on('typing',(msg)=>{
        socket.broadcast.emit('typing',msg);
    });

    socket.on('stoptyping',(msg)=>{
        socket.broadcast.emit('stoptyping',msg);
    });
    //check user disconnect
    socket.on('disconn~ect',()=>{
        console.log(socket.id +' disconnected');
    });
});

// connect.then(db=>{
//     console.log("connected correctly to the database");
// });

http.listen(port,()=>{
    console.log(`Lisetening on port ${port}`);
});