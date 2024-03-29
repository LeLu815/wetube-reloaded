import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    email : { type:String, required:true, unique:true },
    socialOnly : { type:Boolean, default:false },
    username : { type:String, required:true, unique:true },
    password : { type:String },
    name : { type:String, required:true },
    location : String,
    avatarUrl : {type:String,},
    videos : [{type:mongoose.Schema.Types.ObjectId, ref:'Video'}],
    comments : [{type:mongoose.Schema.Types.ObjectId, ref:"Comment"}],
})

userSchema.pre('save', async function() {
    // console.log("Users password", this.password);
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 5);
    }
    // console.log("Hashed password", this.password);
} )

const User = mongoose.model('User', userSchema);

export default User;