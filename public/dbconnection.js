const mongoose = require('mongoose');

const url = "mongodb://localhost:27017/message";

const cpnnect = mongoose.connect(url,{ useNewUrlParser:true });
module.exports = connect;