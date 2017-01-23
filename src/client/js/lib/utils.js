var Config = require('./init');
var Const = require('./consts');
var sha1 = require('sha1');

(function(global) {
    "use strict;"

    // Class ------------------------------------------------
    function Utils() {
    };

    // Header -----------------------------------------------
    Utils.prototype.l = logging; 
    Utils.prototype.goPage = goPage;
    Utils.prototype.ie8Fix = ie8Fix;
    Utils.prototype.formatDate = formatDate;
    Utils.prototype.formatTime = formatTime; 
    Utils.prototype.getRandomString = getRandomString;
    Utils.prototype.now = now;
    Utils.prototype.escapeHtml = escapeHtml;
    Utils.prototype.linkify = linkify;
    Utils.prototype.getURLQuery = getURLQuery;
    Utils.prototype.l10n = localize;
    Utils.prototype.getBaseURL = getBaseURL;
    Utils.prototype.hash = hash;
    Utils.prototype.getChannelIDByRoomID = getChannelIDByRoomID;
    Utils.prototype.getQueryParamByName = getQueryParamByName;
    Utils.prototype.isMobile = isMobile;
    Utils.prototype.createSecret = createSecret;
    Utils.prototype.formatDateyyyymmdd = formatDateyyyymmdd;
    Utils.prototype.chatIdByUser = chatIdByUser;
    Utils.prototype.chatIdByGroup = chatIdByGroup;
    Utils.prototype.chatIdByRoom = chatIdByRoom;
    Utils.prototype.escapeRegExp = escapeRegExp;
    Utils.prototype.strip = strip;
    
    // Implementation ---------------------------------------
    function logging(obj) {
        console.log(obj);
    }

    function goPage(pageName) {
        document.location.href = "#" + pageName;
    }

    function ie8Fix() {
        
        if (typeof window.console == "undefined") {
            window.console = {log: function() {}};
        }

    }
    
    function formatDate(ut,useUserFriendlyText){
        
        var date = new Date(ut);
        // hours part from the timestamp
        var hours = date.getHours();
        // minutes part from the timestamp
        var minutes = date.getMinutes();
        // seconds part from the timestamp
        var seconds = date.getSeconds();
        
        // will display time in 10:30:23 format
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var year = date.getYear();
        
        // dont want include browser detaction library so use this dumb style.
        if(year < 1000){
            year += 1900;
        }
        
        if(hours < 10)
            hours = '0' + hours;
            
        if(minutes < 10)
            minutes = '0' + minutes;
            
        if(seconds < 10)
            seconds = '0' + seconds;
        
        
        if(month < 10)
            month = '0' + month;
        
        if(day < 10)
            day = '0' + day;
        
        var formattedTime = year + '/' + month + '/' + day + ' ' + hours + ':' + minutes + ':' + seconds;
        
        if(useUserFriendlyText == false)
            return formattedTime;
        
        var nowDate = new Date();
        var now = new Date().getTime();
        var interval = (now - ut) / 1000;
        
        if(interval < 60){
            return 'now';
        }
        else if(interval < 60*60){
            return  Math.floor(interval / 60) + " min ago";
        }
        else if(interval < 60*60*24){
            return  Math.floor(interval / 60 / 60) + " hours ago";
        }
        else if(nowDate.getDate() == date.getDate() && nowDate.getMonth() == date.getMonth() && nowDate.getYear() == date.getYear()){
            return  hours + ':' + minutes + ':' + seconds;
        }
        else{
            formattedTime;
        }
        
        
        return formattedTime;
    }

    function formatTime(ut){
        
        var date = new Date(ut);
        // hours part from the timestamp
        var hours = date.getHours();
        // minutes part from the timestamp
        var minutes = date.getMinutes();
        // seconds part from the timestamp
        var seconds = date.getSeconds();
        
        // will display time in 10:30:23 format
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var year = date.getYear();
        
        // dont want include browser detaction library so use this dumb style.
        if(year < 1000){
            year += 1900;
        }
        
        if(hours < 10)
            hours = '0' + hours;
            
        if(minutes < 10)
            minutes = '0' + minutes;
            
        if(seconds < 10)
            seconds = '0' + seconds;
        
        
        if(month < 10)
            month = '0' + month;
        
        if(day < 10)
            day = '0' + day;
        
        var formattedTime = hours + ':' + minutes;
        
        var nowDate = new Date();
        var now = new Date().getTime();
        var interval = now - ut;
        
        if(interval < 60*60){
            return  Math.floor(interval / 60) + " min ago";
        }
        else{
            formattedTime;
        }
        
        
        return formattedTime;
    }


    function formatDateyyyymmdd(ut){
        
        var date = new Date(ut);
        // hours part from the timestamp
        var hours = date.getHours();
        // minutes part from the timestamp
        var minutes = date.getMinutes();
        // seconds part from the timestamp
        var seconds = date.getSeconds();
        
        // will display time in 10:30:23 format
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var year = date.getYear() + 1900;
        
        return year + "." + month + "." + day;
    }
    
    function getRandomString(length){
    
        if(length == undefined)
            length = 32;
            
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
        for( var i=0; i < length; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
    
        return text;
    }
    
    function now(){
        
        Date.now = Date.now || function() { return +new Date; }; 
        
        return Date.now();
        
    }

    function escapeHtml(string) {
            
        var entityMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': '&quot;',
            "'": '&#39;'
        };
    
        return String(string).replace(/[&<>"']/g, function (s) {
            return entityMap[s];
        });
    }

    function linkify(inputText) {
        var replacedText, replacePattern1, replacePattern2, replacePattern3;
    
        //URLs starting with http://, https://, or ftp://
        replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
    
        //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
        replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');
    
        //Change email addresses to mailto:: links.
        replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
        replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');
                
        return replacedText;
    }
    
    function getURLQuery(){
        
        var split = window.location.search.substr(1).split('&');
        
        if (split == "") return {};
        
        var params = {};
        
        for (var i = 0; i < split.length; ++i)
        {
            var p=split[i].split('=', 2);
            if (params.length == 1)
                params[p[0]] = "";
            else
                params[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
    
        return params;

    }
    
    function localize(text){
	    
	     return localizationManager.get(text);	
 
    }

    function getBaseURL(){
	    
	    var url = window.location.href;
        var divided = url.split("/");
        
        return divided[0] + "/" + divided[1] + "/" + divided[2];
	    
    }


    function hash(string){

        var sha1 = require('sha1');
        return sha1(string + Config.hashSalt);
        
    }
    
    function getChannelIDByRoomID(roomID){
        
        if(!roomID)
            return "";
        
        if(roomID.length > 24){
            return roomID.substr(0,24);
        }else
            return roomID;
        
    }
    
    function getQueryParamByName(name){

        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++){
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        
        return vars[name];
    
    }
    
    function isMobile(){
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
    
    function createSecret(time){

        var tenSec = Math.floor(time / 1000 / 10) + '';
        var key =  Config.hashSalt + tenSec;
        var hash = sha1(key);
        
        return hash;
        
    }
    
    function chatIdByUser(user1,user2){

            
        var chatId = "";
        
        if(user1.created < user2.created){
            
            chatId = Const.chatTypePrivate + "-" + user1._id + "-" + user2._id;
            
        } else {
            
            chatId = Const.chatTypePrivate + "-" + user2._id + "-" + user1._id;
            
        }
        
        return chatId;
        
    }

    function chatIdByGroup(group){
        return Const.chatTypeGroup + "-" + group._id;
    }
    
    function chatIdByRoom(room){
        return Const.chatTypeRoom + "-" + room._id;
    }
    
    function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    function strip(text,limit){

        if(!text)
            return "";

        if(text.length <= limit)
            return text;

        else
            return  text.substring(0,limit) + "…";
    }

    // Exports ----------------------------------------------
    module["exports"] = new Utils();

})((this || 0).self || global);

var localizationManager = require('./localzationManager');