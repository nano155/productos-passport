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
        required: true,
    },
    cart:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts',
        required: true
    },
    role:{
        type:String,
        enum:['admin', 'user'],
        default: 'user'
    }
})
usersSchema.pre('findOne', function() {
    this.populate("cart");
});
export const usersModel = mongoose.model('users', usersSchema)