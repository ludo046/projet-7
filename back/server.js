//imports
const express = require('express');
const apiRouter = require('./apiRouter').router;
const path = require('path');



//instantiate server
const server = express();

//parser config
server.use(express.urlencoded({ extended:true }));
server.use(express.json())

//configure routes
server.use('/', function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

const http = require('http');
const httpServer = http.Server(server);

const socketIO = require('socket.io');
const io = socketIO(httpServer)

server.use('/api/', apiRouter);
server.use('/images', express.static(path.join(__dirname, 'images')));

//launch server
server.listen(8080, function(){
    console.log('Server en écoute :)');
})

io.on('connection', (socket) => {
    socket.on('join',(data) => {
        socket.join(data.room);
        socket.broadcast.to(data.room).emit('user joined')
    });
    socket.on('message', (data) => {
        io.in(data.room).emit('new message', {user:data.user, message: data.message})
    })
})
