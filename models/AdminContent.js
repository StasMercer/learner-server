const { model, Schema } = require("mongoose");

const adminContent = new Schema({
    contentName: String,
    messages: [{messageHeader: String, messageText: String, createdAt: String, media:String}]
});

module.exports = model("AdminContent", adminContent);
