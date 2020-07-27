const moment = require('moment');
const { model } = require('mongoose');

function formatedMessage(sender,receiver,message)
{
    return {
        sender,
        receiver,
        message,
        time:moment().format('h:mm A')
    }
}

function formatedMessageLink(sender,receiver,urlData)
{
    return{
        sender,
        receiver,
        urlData,
        time:moment().format('h:mm A')
    }
}

module.exports = formatedMessage;
model.exports = formatedMessageLink;
