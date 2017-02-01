/** Constants */

    var Const = {};

    Const.responsecodeSucceed = 1;
    Const.responsecodeUnknownError = 4000000;
    
    Const.responsecodeSigninNoUserid = 4000001;
    Const.responsecodeSigninNoPassword = 4000002;
    Const.responsecodeSigninNoOrganizationId = 4000003;
    Const.responsecodeSigninWrongSecret = 4000004;
    Const.responsecodeSigninWrongOrganizationId = 4000005;
    Const.responsecodeSigninWrongUserCredentials = 4000006;
    Const.responsecodeSigninInvalidToken = 4000007;
    Const.responsecodeUpdateProfileInvalidName = 4000008;
    Const.responsecodeUpdateProfileInvalidFile = 4000009;
    Const.responsecodeUpdatePasswordWrongCurrentPassword = 4000010;
    Const.responsecodeUpdatePasswordWrongNewPassword = 4000011;
    Const.responsecodeUpdateRoomWrongRoomId = 4000012;
    Const.responsecodeUpdateRoomWrongRoomName = 4000013;
    Const.responsecodeUpdateRoomWrongFile = 4000014;
    Const.responsecodeLeaveRoomWrongRoomId = 4000015;
    Const.responsecodeGetOnlineStatusInvalidUserId = 4000016;
    Const.responsecodeUserDetailInvalidUserId = 4000017;
    Const.responsecodeGroupDetailInvalidGroupId = 4000018;
    Const.responsecodeRoomDetailInvalidRoomId = 4000019;
    Const.responsecodeAddToFavoriteNoMessageId = 4000020;
    Const.responsecodeAddToFavoriteInvalidMessageId = 4000021;
    Const.responsecodeAddToFavoriteExistedMessageId = 4000022;
    Const.responsecodeRemoveFromFavoriteNoMessageId = 4000023;
    Const.responsecodeRemoveFromFavoriteInvalidMessageId = 4000024;
    Const.responsecodeAddUsersToRoomWrongRoomId = 4000025;
    Const.responsecodeAddUsersToRoomWrongUserId = 4000026;
    Const.responsecodeRemoveUsersFromRoomWrongRoomId = 4000027;
    Const.responsecodeRemoveUsersFromRoomWrongUserId = 4000028;
    Const.responsecodeForwardMessageInvalidChatId = 4000029;
    Const.responsecodeForwardMessageInvalidMessageId = 4000030;
    Const.responsecodeSavePushTokenWrongToken = 4000031;
    Const.responsecodeStickersWrongOrganizationId = 4000032;
    Const.responsecodeAddInboundHookWrongTargetType = 4000033;
    Const.responsecodeAddInboundHookWrongTargetId = 4000034;
    Const.responsecodeAddInboundHookWrongUserId = 4000035;
    Const.responsecodeAddOutgoingHookWrongURL = 4000036;
    Const.responsecodeAddOutgoingHookWrongUserId = 4000037;
    Const.responsecodeUpdateInboundHookWrongTargetType = 4000038;
    Const.responsecodeUpdateInboundHookWrongTargetId = 4000039;
    Const.responsecodeUpdateInboundHookWrongHookId = 4000040;
    Const.responsecodeUpdateOutgoingHookWrongURL = 4000041;
    Const.responsecodeUpdateOutgoingHookWrongHookId = 4000042;
    Const.responsecodeRemoveInboundHookWrongHookId = 4000043;
    Const.responsecodeRemoveOutgoingHookWrongHookId = 4000044;
    Const.responsecodeAddOutgoingHookWrongTargetType = 4000045;
    Const.responsecodeAddOutgoingHookWrongTargetId = 4000046;
    Const.responsecodeUpdateOutgoingHookWrongTargetType = 4000047;
    Const.responsecodeUpdateOutgoingHookWrongTargetId = 4000048;
    Const.responsecodeInboundHookWringIdentifier = 4000049;
    Const.responsecodeSigninNoOrganizationid = 4000050;
    Const.responsecodePingOKInvalidParam = 4000051;
    Const.responsecodeLoginInvalidParam = 4000052;
    Const.responsecodeCallingInvalidParamInvalidUserId = 4000053;
    Const.responsecodeCallingInvalidParamNoMediaType = 4000054;
    Const.responsecodeCallingInvalidParamNoRejectType = 4000055;
    Const.responsecodeFailedToSendMessage = 4000056;
    Const.responsecodeMaxRoomNumber = 4000057;
    Const.responsecodeMuteWrongParam = 4000058;
    Const.responsecodeBlockWrongParam = 4000059;
    Const.responsecodeUserBlocked = 4000060;
    Const.responsecodeDeviceRejected = 4000061;
    Const.responsecodeSignupNoOrganizationId = 4000062;
    Const.responsecodeSignupUserAlreadyVerified = 4000063;
    Const.responsecodeSignupInvalidActivationCode = 4000064;
    Const.responsecodeSignupInvalidUserName = 4000065;
    Const.responsecodeSignupInvalidPassword = 4000066;

    Const.httpCodeSucceed = 200;
    Const.httpCodeForbidden = 403;
    Const.httpCodeFileNotFound = 404;
    Const.httpCodeServerError = 500;

    Const.thumbSize = 256;
    Const.searchLimit = 10;
 
    Const.REUsername = /^[0-9A-Za-z._+-]{6,}$/;
    Const.REPassword = /^[0-9A-Za-z._+-]{6,}$/;
    Const.RENumbers = /^[0-9]*$/;
    
    Const.sessionkey = "spikaenterprisesession";
    Const.sessionsalt = "8zgqvU6LaziThJI1uz3PevYd";
    
    Const.tokenLength = 16;
    Const.pagingRows = 20;
    
    Const.tokenValidInteval = 60*60*24*1000 * 30;
    //Const.tokenValidInteval = 30*1000; // ms

    Const.chatTypePrivate = 1;
    Const.chatTypeGroup = 2;
    Const.chatTypeRoom = 3;
    
    Const.maxBatchSizeFindResult = 5000;

    Const.redisKeyOnlineStatus = 'onlinestatus_';
    Const.redisKeySocketId = "socketid_";
    Const.redisKeyUserId = "userid_";
    Const.redisKeyCurrentRoomId = "currentroom_";
    Const.redisKeySocketIdPool = "socketidpool_";
    Const.redisCallQueue = "callqueue_";
    Const.redisCallQueue = "callqueue_";
    Const.adminForcelogoutList = "adminforcelogoutlist";

    Const.groupType = { group: 1, department: 2 };

    Const.pushTokenThreadSize = 50;
    Const.apnCategoryMessage = "message";
    
    Const.hookTypeInbound = 1;
    Const.hookTypeOutgoing = 2;
    
    Const.userPermission = { webClient: 1, organizationAdmin: 2, subAdmin: 3 };

    Const.stickerType = { owner: 1, admin: 2 };
    
    Const.botUserIdPrefix = "b0200000000000000000";
    
    Const.heartBeatInterval = 10; // sec
    
    Const.hostidFile = "hostid"; // sec
    
    Const.callFaildOffline = 1;
    Const.callFaildUserBusy = 2;
    Const.callFaildUserRejected = 2;
    
    Const.gigabyteToByteMultiplier = 1000000000;

    Const.messageTypeText = 1;
    Const.messageTypeFile = 2;
    Const.messageTypeLocation = 3;
    Const.messageTypeContact = 4;
    Const.messageTypeSticker = 5;
    
    Const.pushTypeNewMessage = 1;
    Const.pushTypeCall = 2;
    Const.pushTypeCallClose = 3;

    Const.muteActionMute = 'mute';
    Const.muteActionUnmute = 'unmute';

    Const.blockActionBlock = 'block';
    Const.blockActionUnblock = 'unblock';

    Const.userStatus = {
        disabled: 0, 
        enabled: 1
    };

    // Exports ----------------------------------------------
    module["exports"] = Const;