var express = require('express');
const { env } = require('process');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var fs = require('fs');

const port = process.env.port || 5000;
var dbUrl = "mongodb+srv://thure1nhtunn:mKSIY64RdgKiWVcH@cluster0.hvkc9.mongodb.net/chatdb?retryWrites=true&w=majority";

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
  })

mongoose.connect(dbUrl,{ useNewUrlParser:true, useUnifiedTopology:true },(err)=>{
    if(err)
    {
        console.log(err)
    }
    console.log('Mangodb connected...');
});

io.on('connection',(socket)=>{
    //check user connected
    console.log(socket.client.id +' connected..');

    socket.on('message',(msg)=>{
        socket.broadcast.emit('message', msg);
    });

    socket.on('typing',(msg)=>{
        console.log('typing');
    });

    socket.on('image',(msg)=>{
        socket.broadcast.emit('userimage', msg);
    });
    //check user disconnect
    socket.on('disconn~ect',()=>{
        console.log(socket.id +' disconnected');
    });
});


http.listen(port,()=>{
    console.log(`Lisetening on port ${port}`);
});