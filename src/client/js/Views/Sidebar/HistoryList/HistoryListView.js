var Backbone = require('backbone');
var _ = require('lodash');

var Utils = require('../../../lib/utils');
var UIUtils = require('../../../lib/UIUtils');
var Const = require('../../../lib/consts');
var Config = require('../../../lib/init');

var loginUserManager = require('../../../lib/loginUserManager');
var ChatManager = require('../../../lib/ChatManager');
var localzationManager = require('../../../lib/localzationManager');

var HistoryListClient = require('../../../lib/APIClients/HistoryListClient');

var template = require('./HistoryListView.hbs');
var templateContents = require('./HistoryListContents.hbs');

var HistoryListView = Backbone.View.extend({
    
    dataList: [],
    container : "",
    currentPage : 1,
    isReachedToEnd: false,
    lastUpdate : 0,
    initialize: function(options) {
        this.container = options.container;
        this.render();
    },

    render: function() {

        $(this.container).html(template({
            Config:Config
        }));
        
        this.onLoad();
        
        return this;

    },

    onLoad: function(){
        
        console.log("history onload 2");
        
        var self = this;
        
        this.dataList = [];
        
        $("#sidebar-historylist .listview").on('scroll',function() {
            
            if(self.isLoading)
                return;


            // check is bottom
            if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
                
                self.loadNext();
                
            }
            
        });

        Backbone.on(Const.NotificationRefreshHistory, function(){
            
            self.updateList();
            
        });

        Backbone.on(Const.NotificationRemoveRoom, function(obj){
            
            var newDataList = _.filter(self.dataList,function(historyObj){
	        	
	        	if(!obj.room || !historyObj.room)
	        		return true;
				
				if(obj.room._id == historyObj.room._id)
					return false;
				else
					return true;
	        	 
            });
            
            self.dataList = newDataList;
            self.updateList();
            
        });
        
        
        
        this.loadNext();
        
    },
    updateList: function(){

        var self = this;
        
        var lastUpdate = 0;

        if(this.dataList.length > 0){

            var sortByLastUpdate = _.sortBy(this.dataList,function(historyObj){
                
                return -1 * historyObj.lastUpdate;
                
            });
            
            lastUpdate = sortByLastUpdate[0].lastUpdate;
            
        }
        
        HistoryListClient.sendUpdate(lastUpdate,function(data){
            
            console.log("history data",data);
            
            self.mergeData(data.list);
            self.renderList(); 
            
            Backbone.trigger(Const.NotificationUpdateUnreadCount,data.totalUnreadCount);
            
        },function(errorCode){
            
            console.log(errorCode);
            UIUtils.handleAPIErrors(errorCode);
            
        });
        
    },
    loadNext: function(){
        
        if(this.isReachedToEnd)
            return;
            
        var self = this;

        HistoryListClient.send(this.currentPage,function(data){
            
            if(data.list.length == 0)
                self.isReachedToEnd = true;
                
            else{
                
                if(self.currentPage == 1){
                    $("#sidebar-historylist .listview").html('');
                }
                
                self.mergeData(data.list);
                self.currentPage++;
                self.renderList(); 

            }
            
            Backbone.trigger(Const.NotificationUpdateUnreadCount,data.totalUnreadCount);
            
        },function(errorCode){
            
            console.log(errorCode);
            UIUtils.handleAPIErrors(errorCode);
            
        });
            
        
    },
    
    mergeData : function(array){
        
        var self = this;
        
        _.forEach(array,function(updatedHistoryObj){
            
            var isNew = false;
            
            var existedObj = _.find(self.dataList,function(historyObj){
                
                return historyObj._id == updatedHistoryObj._id;
                 
            });
            
            if(!existedObj)
                isNew = true;
            
            if(isNew){

                self.dataList.push(updatedHistoryObj);
                
            }else{
                
                self.dataList = _.map(self.dataList,function(element){
                    
                    if(element._id == updatedHistoryObj._id)
                        return updatedHistoryObj;
                    else
                        return element;
                     
                });
                
            }
            
                
        });
        
        this.dataList = _.sortBy(this.dataList,function(historyObj){
            
            return -1 * historyObj.lastUpdate;
             
        });
        
    },
    renderList: function(){
        
        var self = this;
        
        this.dataList = _.map(this.dataList,function(row){

            if(row.lastMessage){

                if(row.lastMessage.type == 2)
                    row.lastMessage.message = localzationManager.get("File");

                if(row.lastMessage.type == 3)
                    row.lastMessage.message = localzationManager.get("Location");

                if(row.lastMessage.type == 4)
                    row.lastMessage.message = localzationManager.get("Contact");

                if(row.lastMessage.type == 5)
                    row.lastMessage.message = localzationManager.get("Sticker");
            }
            
            return row;
        });

        console.log(this.dataList);

        var html = templateContents({
            list: this.dataList
        });
        
        $("#sidebar-historylist .listview").html(html);
        
        $('#sidebar-historylist .chat-target').unbind().on('click',function(){
            
            var historyId = $(this).attr('id');

            self.startChat(historyId);
             
        });
        
        
    },
    startChat: function(historyId){
        
        var historyObj = _.find(this.dataList,function(row){
            return row._id == historyId
        });
        
        if(!historyObj)
            return;
        
        if(historyObj.chatType == Const.chatTypePrivate){
            
            ChatManager.openChatByUser(historyObj.user);
            
        }else if(historyObj.chatType == Const.chatTypeGroup){

            ChatManager.openChatByGroup(historyObj.group);
            
        }else if(historyObj.chatType == Const.chatTypeRoom){

            ChatManager.openChatByRoom(historyObj.room);

        }

    },
    destroy: function(){
        
        console.log('history destroy');
        
        Backbone.off(Const.NotificationRefreshHistory);
        Backbone.off(Const.NotificationRemoveRoom);
        
    }
    
    
});

module.exports = HistoryListView;