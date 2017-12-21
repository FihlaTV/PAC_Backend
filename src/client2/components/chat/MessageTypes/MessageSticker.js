import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import * as config from '../../../lib/config';
import * as actions from "../../../actions";


class MessageSticker extends Component {

    static propTypes = {
    }
    constructor(){
        super();
    }

    render() {
        const message = this.props.message;        
        let messageClass = typeof message._id === 'undefined' ? 'sticker-message unsent' : 'sticker-message';

        const isDeleted = message.message.length === 0;
        messageClass = isDeleted ?  'text-message' : messageClass;

        return(
            <p className={messageClass} onClick={e => this.props.getMessageInfo(message)}>
                {isDeleted 
                ? <i>This message is deleted.</i>
                : <img className={messageClass} onLoad={e => this.props.scrollChat()} src={config.mediaBaseURL + message.message}/>}
            </p>
        );
    }

}

const mapStateToProps = (state) => {
    return {       
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getMessageInfo: message => dispatch(actions.messageInfo.getMessageInfo(message))        
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MessageSticker);
