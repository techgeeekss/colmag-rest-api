const mongoose = require('mongoose');

const StudentScheme = new mongoose.Schema({
    subject:{
        type:String,
        required:true
    },
    content:{
        type:String, 
        maxlength:2500
    }
})