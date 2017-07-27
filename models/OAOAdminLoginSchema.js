var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//messages and mandatory fields

var OAOAdminLogin = new Schema({

    username: { type: String },
    password: { type: String },
    lname: { type: String },
    email: { type: String },
    mobile: { type: Number },
    role: { type: String }


});

module.exports = mongoose.model('OAOAdminLogin', OAOAdminLogin);