
var _ = require('lodash');
var async = require('async');

var DatabaseManager = require("../lib/DatabaseManager");
var EncryptionManager = require("../lib/EncryptionManager");

var Utils = require("../lib/utils");
var Const = require("../lib/consts");
var Config = require("../lib/init");
var SocketHandlerBase = require("./SocketHandlerBase");
var SocketAPIHandler = require("./SocketAPIHandler");

var UserModel = require("../Models/User");
var MessageModel = require("../Models/Message");

var DeliverMessageActionHandler = function () {

}

_.extend(DeliverMessageActionHandler.prototype, SocketHandlerBase.prototype);

DeliverMessageActionHandler.prototype.attach = function (io, socket) {

    var self = this;

    /**
     * @api {socket} "deliverMessage" Deliver Message
     * @apiName Deliver Message
     * @apiGroup Socket 
     * @apiDescription Get delivered message
     * @apiParam {string} userID User ID
     * @apiParam {string} messageID Message ID
     */

    socket.on('deliverMessage', function (param) {

        if (!param.userID)
            return socket.emit('socketerror', { code: Const.resCodeSocketDeliverMessageNoUserId });

        if (!param.messageID)
            return socket.emit('socketerror', { code: Const.resCodeSocketDeliverMessageNoMessageId });

        var messageModel = MessageModel.get();
        var userModel = MessageModel.get();

        async.waterfall([(done) => {

            var result = {};

            messageModel.findOne({
                _id: param.messageID
            }, (err, findResult) => {

                result.message = findResult;

                // do nothing for message sent user
                if (findResult.userID == param.userID) {
                    return;
                }

                done(err, result);

            });

        },
        (result, done) => {

            if (param.doNotUpdateSeenBy)
                return done(null, result);

            var seenByRow = {
                user: param.userID,
                at: Utils.now(),
                version: 2
            };

            messageModel.update({
                _id: param.messageID
            }, {
                    $push: {
                        seenBy: seenByRow
                    }
                }, (err, updateResult) => {


                });

            result.message.seenBy.push(seenByRow);

            done(null, result);

        },
        (result, done) => {

            MessageModel.populateMessages([result.message], function (err, data) {

                done(err, data[0]);

            });

        },
        (message, done) => {

            done(null, message);

        }],

            (err, message) => {

                if (err) {
                    socket.emit('socketerror', { code: Const.resCodeSocketUnknownError });
                    return;
                }

                var chatType = message.roomID.split("-")[0];

                // websocket notification
                if (chatType == Const.chatTypeGroup) {

                    SocketAPIHandler.emitToRoom(message.roomID, 'updatemessages', [message]);

                } else if (chatType == Const.chatTypeRoom) {

                    SocketAPIHandler.emitToRoom(message.roomID, 'updatemessages', [message]);

                } else if (chatType == Const.chatTypePrivate) {

                    var splitAry = message.roomID.split("-");

                    if (splitAry.length < 2)
                        return;

                    var user1 = splitAry[1];
                    var user2 = splitAry[2];

                    var toUser = null;
                    var fromUser = null;

                    if (user1 == param.userID) {
                        toUser = user2;
                        fromUser = user1;
                    } else {
                        toUser = user1;
                        fromUser = user2;
                    }

                    // send to myself
                    DatabaseManager.redisGet(Const.redisKeyUserId + fromUser, function (err, redisResult) {

                        var socketIds = _.pluck(redisResult, "socketId");

                        if (!_.isArray(redisResult))
                            return;

                        _.forEach(redisResult, function (socketIdObj) {
                            SocketAPIHandler.emitToSocket(socketIdObj.socketId, 'updatemessages', [message]);
                        })

                    });

                    // send to user who got message
                    DatabaseManager.redisGet(Const.redisKeyUserId + toUser, function (err, redisResult) {

                        var socketIds = _.pluck(redisResult, "socketId");

                        if (!_.isArray(redisResult))
                            return;

                        _.forEach(redisResult, function (socketIdObj) {
                            SocketAPIHandler.emitToSocket(socketIdObj.socketId, 'updatemessages', [message]);
                        })

                    });

                }

            });

    });

}

module["exports"] = new DeliverMessageActionHandler();