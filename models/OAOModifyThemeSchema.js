var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//messages and mandatory fields

var OAOModifyTheme = new Schema({
    background_color: { type: String },
    text_color: { type: String },
    font_size: { type: String },
    font_weight: { type: String },
    font_family: { type: String },
    btn_text_color: { type: String },
    bck_btn_color: { type: String },
    progress_bar_1: { type: String },
    progress_bar_2: { type: String },
    updated_flag: { type: Boolean },
    reset_flag: { type: Boolean }
});

module.exports = mongoose.model('OAOModifyTheme', OAOModifyTheme);