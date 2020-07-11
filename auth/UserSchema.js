const mongoose =  require('mongoose');

const UserSchema = new mongoose.Schema({
    _id:{
        type : String,
        required : true,
        maxlength:25
    },
    password:{
        type : String,
        required: true,
    },
    token:{
        type : String
    }
});

const User = mongoose.model('User',UserSchema);

module.exports = User;
