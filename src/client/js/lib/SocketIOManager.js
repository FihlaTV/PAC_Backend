var socket = require('socket.io-client');
var Backbone = require('backbone');
var _ = require('lodash');

var Const = require('./consts');
var Config = require('./init');
var Utils = require('./utils');

var loginUserManager = require('./loginUserManager');
var NotificationManager = require('./NotificationManager');

var socketIOManager = {
    
    io : null,
    processId: null,
    init:function(){
        
        var self = this;
                
        this.processId = Utils.getRandomString(16);
        
        this.io = socket;
        
        this.ioNsp = this.io(Config.socketUrl);

        this.ioNsp.on('connect',function(){

	        var userToken = loginUserManager.getToken();
	
	        if(userToken){
	
	            self.emit('login',{
	                token : userToken,
	                processId : self.processId
	            });
	
	        }
        
        });
        
        this.ioNsp.on('reconnect',function(){

	        
        });
        
        this.ioNsp.on('socketerror', function(error){
            
            /*
            
            var alertDialog = require('../Views/Modals/AlertDialog/AlertDialog');

            var message = "";
            
            if(Const.ErrorCodes[error.code])
                message = Utils.l10n(Const.ErrorCodes[error.code]);
            else
                message = Utils.l10n("Critical Error");
                
            alertDialog.show(Utils.l10n("Api Error"),message);
            
            */
            
        });

        this.ioNsp.on('newmessage', function(obj){
            
            Backbone.trigger(Const.NotificationRefreshHistory);
            NotificationManager.handleNewMessage(obj);

        });
            
        this.ioNsp.on('spikaping', function(obj){

            self.emit('pingok',{
                userId : loginUserManager.getUser()._id,
                processId : self.processId 
            });

        });
        
        this.ioNsp.on('call_failed', function(obj){

            Backbone.trigger(Const.NotificationCallFaild,obj);

        });


        this.ioNsp.on('call_request', function(obj){

            Backbone.trigger(Const.NotificationCallRequest,obj);

        });
 
         this.ioNsp.on('call_received', function(){
			 
            Backbone.trigger(Const.NotificationCallReceived);

        });
        
        this.ioNsp.on('call_cancel', function(){

            Backbone.trigger(Const.NotificationCallCancel);

        });

        this.ioNsp.on('call_reject_mine', function(){

            Backbone.trigger(Const.NotificationCallRejectMine);

        });

        this.ioNsp.on('call_answer', function(){

            Backbone.trigger(Const.NotificationCallAnswer);

        });
        
        this.ioNsp.on('call_close', function(){

            Backbone.trigger(Const.NotificationCallClose);

        });
        
        
    },
    
    emit:function(command,params){

        var command = arguments[0];
        this.ioNsp.emit(command, params);
        
    },

    disconnect: function(){

        //alert('send disconnect');

        if(!this.ioNsp.disconnected)
            this.ioNsp.disconnect();

    }
        
};

// Exports ----------------------------------------------
module["exports"] = socketIOManager;
