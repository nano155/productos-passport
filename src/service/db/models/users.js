import  mongoose  from "mongoose";

const usersSchema =  new mongoose.Schema({
    first_name: {
        type:String,
    },
    last_name:{
        type:String,
    },
    email:{
        type: String,
        required:true,
        unique: true,
    },
    age:{
        type: Number,
        required:true,
        unique: true,
    },
    password: {
        type: String,
        unique: true,
    }
})

export const usersModel = mongoose.model('users', usersSchema)