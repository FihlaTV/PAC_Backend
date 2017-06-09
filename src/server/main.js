/** Main of server side backend */

var socket = require('socket.io');
var express = require('express');
var http = require('http');
var signaling = require('../../modules_customised/webrtcsignaling/sockets')
var geoip = require('geoip-lite');
var path = require('path');

var Conf = require('./lib/init.js');

var WebAPI = require('./WebAPI/WebAPIMain');
var SocketAPI = require('./SocketAPI/SocketAPIHandler');

var DatabaseManager = require('./lib/DatabaseManager');
var SocketConnectionHandler = require('./lib/SocketConnectionHandler');
var OnlineStatusChecker = require('./lib/OnlineStatusChecker');

if(!Conf.useCluster){
    startServer();
}else{

    var cluster = require('cluster');
    var numCPUs = require('os').cpus().length;

    if (cluster.isMaster) {

        console.log(`Master ${process.pid} is running`);

        // Fork workers.
        for (var i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`);
        });

    } else {
        
        startServer();

        console.log(`Worker ${process.pid} started`);
    }

}

function startServer(){

    // initialization
    var app = express();
    var server = http.createServer(app);
    var port = Conf.port;
    var io = socket.listen(server);

    DatabaseManager.init(function(success){

        if(!success){

            console.log('Failed to connect DB');
            process.exit(1);

        } else {

            // starts process in valid directory (spika-enterpriese-server)
            process.chdir(path.resolve(__dirname, "../.."));

            app.all('*', function(req, res, next) {
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
                res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, access-token');
                next();
            });

            WebAPI.init(app);
            SocketAPI.init(io);
            OnlineStatusChecker.start();
            
            if(!SocketConnectionHandler.init()){
                process.exit(1);
            }
            
            // start signaling server
            signaling(io, Conf.webRTCConfig);  

            // not found URL error handle
            app.get('*', function(request, response) {

                var defaultParameters = {
                    Config: Conf,
                    AssetURL: "/assets",
                    layout: "Front/Views/FrontLayout"
                };

                response.status(404).render("Front/Views/NotFound/NotFound", defaultParameters);

            });

            server.on('connection', function(socket) {
                socket.setTimeout(0);
            })

            server.setTimeout(0, function(param){
                console.log('timeout');
            });

            server.listen(Conf.port, function(){
                console.log('Server listening on port ' + Conf.port + '!');
            });

            process.on('uncaughtException', function(err) {
                console.log('Caught exception: ' + err);
            });
            
        }

    });

}
