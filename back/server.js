//imports
const express = require('express');
const apiRouter = require('./apiRouter').router;
const path = require('path')

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

server.use('/api/', apiRouter);
server.use('/images', express.static(path.join(__dirname, 'images')));

//launch server
server.listen(8080, function(){
    console.log('Server en écoute :)');
})
