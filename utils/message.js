const moment = require('moment');

function formatedMessage(sender,receiver,message)
{
    return {
        sender,
        receiver,
        message,
        time:moment().format('h:mm a')
    }
}

module.exports = formatedMessage;
