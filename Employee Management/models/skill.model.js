const mongoose = require('mongoose');

var skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'this field is required'
    },
    description: {
        type: String
    },
    created: {
        type: Date
    }
});

mongoose.model('Skill', skillSchema);