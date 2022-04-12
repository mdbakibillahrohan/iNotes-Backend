const mongoose = require('mongoose');
const { Schema } = require("mongoose");

const noteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
    },
    tag: {
        type: String,
        default: "General"
    },
    timestamp: {
        type: Date,
        default: Date.now
    },

})

module.exports = mongoose.model('notes', noteSchema)