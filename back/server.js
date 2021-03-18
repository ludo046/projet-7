//imports
const express = require('express');
const apiRouter = require('./apiRouter').router;

//instantiate server
const server = express();

//parser config
server.use(express.urlencoded({ extended:true }));
server.use(express.json())

//configure routes
server.get('/', function(req,res){
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Content-Type','text/html');
    res.status(200).send('<h1>Bonjour sur mon serveur</h1>')
});

server.use('/api/', apiRouter);

//launch server
server.listen(8080, function(){
    console.log('Server en écoute :)');
})
