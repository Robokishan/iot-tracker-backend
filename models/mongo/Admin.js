const mongoose = require('mongoose')
var Schema = mongoose.Schema;

const adminSchema = new Schema({
    owner_id:{
        type: String, unique: true 
    },
    user_name :{ 
        type: String,
        required: true, 
        unique: true 
    },
    owner_name:{
        type: String,
        required : true
    },
    owner_details: {
        type:Object,
        required: true
    },
    created_on:{
        type: Number,
        required: true,
    },
    modified_on:{
        type: Number,
        required: true,
    },
    address: {
        type: Object,
         required: false
    },
    avatar :{
        type: String,
        required: false
    },
    email : {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Admin',adminSchema)