var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('lodash');
var bootstrapSwitch = require('bootstrap-switch');

var Utils = require('../../lib/utils');
var UIUtils = require('../../lib/UIUtils');
var Const = require('../../lib/consts');
var Config = require('../../lib/init');

var NotificationManager = require('../../lib/NotificationManager');
var loginUserManager = require('../../lib/loginUserManager');
var ChatManager = require('../../lib/ChatManager');

var AddToFavoriteClient = require('../../lib/APIClients/AddToFavoriteClient');
var RemoveFromFavoriteClient = require('../../lib/APIClients/RemoveFromFavoriteClient');
var UserDetailClient = require('../../lib/APIClients/UserDetailClient');

var template = require('./MessageDetail.hbs');

var MessageDetailView = Backbone.View.extend({

    el : null,
    currentMessage:null,
    initialize: function(options) {
        this.el = options.container;
        this.render();
    }, 

    render: function() {
        this.onLoad();
        return this;
    },

    onLoad: function(){
        
        var self = this;
        
        Backbone.on(Const.NotificationSelectMessage, function(obj){

            self.renderMessage(obj.message);
              
        });
        
    },

    adjustSize: function(){
        
        
        
    },

    renderMessage: function(obj){

        var self = this;
        
        self.currentMessage = obj;
        
        $(self.el).html(template(obj));
        $(self.el).addClass('on');
        
        if(obj.userID == loginUserManager.user._id){
            $('#btn-deletemessage').show();
        }else{
            $('#btn-deletemessage').hide();
        }
        
        if(!obj.deleted || obj.deleted == 0){
            $('.deltedalert').hide();
            $('#btn-addtofavorite').show();
            $('#btn-removefromfavorite').show();
            
        }else{
            
            $('.deltedalert').show();
            $('#btn-deletemessage').hide();  
            $('#btn-removefromfavorite').hide();
            $('#btn-addtofavorite').hide();      
        }

        $('#btn-closeinfoview').unbind().on('click',function(){
            
            $(self.el).removeclass('on');
            
        });
        
        $('#btn-deletemessage').unbind().on('click',function(){
            
            if(confirm(LocalizationManager.localize('Are you sure to delete this message ?'))){
                
                socketIOManager.emit('deleteMessage',{
                    messageID: self.currentMessage.get('id'),
                    userID: LoginUserManager.user.get('id')
                });
                
                $(self.el).removeclass('on');
                                
            }
            
        });
        
        $('#btn-addtofavorite').unbind().on('click',function(){

            $(this).attr('disabled','disabled');

            AddToFavoriteClient.send(self.currentMessage._id,function(data){
                
                obj.isFavorite = 1;
                self.renderMessage(obj);
                Backbone.trigger(Const.NotificationMessageUpdated,[obj]);
                
            },function(errCode){
                var UIUtils = require('../../lib/UIUtils');
                UIUtils.handleAPIErrors(errCode);
            });

/*
            window.SpikaAdapter.bridgeFunctions.addToFavorite(self.currentMessage.get('id'),function(data){

                self.currentMessage.set('isFavorite',true);

                Backbone.trigger(CONST.EVENT_MESSAGE_SELECTED,self.currentMessage);
                Backbone.trigger(CONST.EVENT_ON_MESSAGE_UPDATED,[self.currentMessage.toObject()]);

            });
*/

        });
        
        $('#btn-removefromfavorite').unbind().on('click',function(){
            
            $(this).attr('disabled','disabled');

            RemoveFromFavoriteClient.send(self.currentMessage._id,function(data){
                
                obj.isFavorite = 0;
                self.renderMessage(obj);
                Backbone.trigger(Const.NotificationMessageUpdated,[obj]);
                

            },function(errCode){
                var UIUtils = require('../../lib/UIUtils');
                UIUtils.handleAPIErrors(errCode);
            });

/*
            window.SpikaAdapter.bridgeFunctions.removeFromFavorite(self.currentMessage.get('id'),function(data){

                self.currentMessage.set('isFavorite',false);
                Backbone.trigger(CONST.EVENT_MESSAGE_SELECTED,self.currentMessage);
                Backbone.trigger(CONST.EVENT_ON_MESSAGE_UPDATED,[self.currentMessage.toObject()]);
                
            });
*/
        });
        
        $('#btn-getlink').unbind().on('click',function(){
            
            var link = U.getBaseURL() + "/#message-" + self.currentMessage.id;
            if(self.copyTextToClipboard(link)){
                alert(LocalizationManager.localize('Link is copied to clip board.'));
            }else{
                alert(LocalizationManager.localize('Failed to copy, please copy manually this url -- ' + link));
            }

        });
        
        $('#btn-forward').unbind().on('click',function(){
            
            window.SpikaAdapter.bridgeFunctions.forwardMessage(self.currentMessage.get('id'),function(data){
                

            });
                
        });
            
            
    },

    destroy: function(){
        
        Backbone.off(Const.NotificationSelectMessage);

    },

    copyTextToClipboard : function(text) {
        var textArea = document.createElement("textarea");

        //
        // *** This styling is an extra step which is likely not required. ***
        //
        // Why is it here? To ensure:
        // 1. the element is able to have focus and selection.
        // 2. if element was to flash render it has minimal visual impact.
        // 3. less flakyness with selection and copying which **might** occur if
        //    the textarea element is not visible.
        //
        // The likelihood is the element won't even render, not even a flash,
        // so some of these are just precautions. However in IE the element
        // is visible whilst the popup box asking the user for permission for
        // the web page to copy to the clipboard.
        //

        // Place in top-left corner of screen regardless of scroll position.
        textArea.style.position = 'fixed';
        textArea.style.top = 0;
        textArea.style.left = 0;

        // Ensure it has a small width and height. Setting to 1px / 1em
        // doesn't work as this gives a negative w/h on some browsers.
        textArea.style.width = '2em';
        textArea.style.height = '2em';

        // We don't need padding, reducing the size if it does flash render.
        textArea.style.padding = 0;

        // Clean up any borders.
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';

        // Avoid flash of white box if rendered for any reason.
        textArea.style.background = 'transparent';


        textArea.value = text;

        document.body.appendChild(textArea);

        textArea.select();

        var result = true;
        
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';

        } catch (err) {
            result = false;
        }

        document.body.removeChild(textArea);
        
        return result;
    }

});

module.exports = MessageDetailView;
