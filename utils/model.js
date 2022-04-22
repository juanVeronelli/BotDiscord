const mongoose = require('mongoose');

const Usuario = new mongoose.Schema({
    "user": {
        type: String, 
        required: true
    },
    "statistics": {
        type: Object
    },
    "money": {
        type: Number
    }
})

const model = mongoose.model('USUARIO', Usuario);
module.exports = model;