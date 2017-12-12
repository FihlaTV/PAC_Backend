import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import * as types from '../actions/types';

import login from './login';
import toast from './toast';
import chatUI from './chatUI';
import history from './history';
import userlist from './userlist';
import grouplist from './grouplist';
import chat from './chat';
import infoView from './infoview';
import stickers from './stickers';
import room from './room';
import call from './call';
<<<<<<< HEAD
import files from './files';
import imageView from './imageView';
=======
import searchMessage from './searchMessage';
import favorites from './favorites';
import profile from './profile';
import password from './password';
>>>>>>> 095cf101051f40faf96867c028d52ec94baf1276

const filter = (state = '', action) => {
    switch (action.type) {
        case types.FILTER:
            return action.filter;
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    login,
    toast,
    filter,
    routing,
    chatUI,
    history,
    userlist, 
    grouplist,
    chat,
    infoView,
    stickers,
<<<<<<< HEAD
    createRoom,
    call,
    files,
    imageView
=======
    room,
    call,
    searchMessage,
    favorites,
    profile,
    password
>>>>>>> 095cf101051f40faf96867c028d52ec94baf1276
});

export default rootReducer;
