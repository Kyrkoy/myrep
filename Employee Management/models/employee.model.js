const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Skill = require('./skill.model');

var UserSchema = require('mongoose').model('Skill').schema;
var employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: 'this field is required'
    },
    lastName:{
        type: String,
        required: 'this field is required'
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    city: {
        type: String
    },
    skill: {
        type: Skill,
        ref: 'Skill'
    }
});

mongoose.model('Employee', employeeSchema);