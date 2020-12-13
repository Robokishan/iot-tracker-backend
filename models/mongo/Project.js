const mongoose = require('mongoose')
var Schema = mongoose.Schema;

var project_url = new Schema({
    type: String,
    url:String,
    icon: String
  });

const projectSchema = new Schema({
    name:{
        type: String
    },
    title :{ 
        type: String,
        required: true,
    },
    description:{
        type: String,
        required : true
    },
    url: {
        type:[project_url],
        required: true
    },
    avatar:{
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    },
    created_on:{
        type: Number,
        required: true,
    },
    modified_on:{
        type: Number,
        required: true,
    }
})

module.exports = mongoose.model('Project',projectSchema)