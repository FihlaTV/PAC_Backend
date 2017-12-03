import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import * as types from '../actions/types';
import * as constant from '../lib/const';

const incomingcallRinging = (state = false, action) => {
    switch (action.type) {
        case types.CallIncoming:
            return true;
        case types.CallIncomingClose:
            return false;
        case types.CallIncomingReject:
            return false;
        case types.CallIncomingAccept:
            return false;
        default:
            return state;
    }
};

const incomingCallUser = (state = {}, action) => {
    switch (action.type) {
        case types.CallIncoming:
            return action.call.user;
        case types.CallClose:
            return {};
            
        default:
            return state;
    }
};

const outgoingCallRinging = (state = false, action) => {
    switch (action.type) {
        case types.CallOutgoing:
            return true;
        case types.CallOutgoingClose:
            return false;
        case types.CallOutgoingFailed:
            return false;
        case types.CallOutgoingAnswered:
            return false;
        default:
            return state;
    }
};

const outgoingCallUser = (state = {}, action) => {
    switch (action.type) {
        case types.CallOutgoing:
            return action.call.user;
        case types.CallClose:
            return {};
        default:
            return state;
    }
};

const outgoingStatus = (state = "", action) => {
    switch (action.type) {
        case types.CallOutgoingStatusChanged:
            return action.message;
        default:
            return state;
    }
};

const calling = (state = false, action) => {
    switch (action.type) {
        case types.CallOutgoingAnswered:
            return true;
        case types.CallIncomingAccept:
            return true;
        case types.CallClose:
            return false;
            
        default:
            return state;
    }
};

const callingMediaType = (state = constant.CallMediaTypeVideo, action) => {
    switch (action.type) {
        case types.CallOutgoing:
            return action.call.mediaType;
        case types.CallIncoming:
            return action.call.mediaType;
        default:
            return state;
    }
};

export default combineReducers({
    calling,
    incomingcallRinging,
    incomingCallUser,
    outgoingCallRinging,
    outgoingCallUser,
    outgoingStatus,
    callingMediaType
});;
