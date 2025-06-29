const {Schema , model} = require("mongoose")
const {createHmac, randomBytes } = require('node:crypto');



const UserSchema = new Schema({
    Name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    salt:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true,
    },
    profileUrl:{
        type:String,
        default:"../profile/User_Avatar.png"
    },
    role:{
        type:String,
        enum : ["USER","ADMIN"],
        default:"USER"
    }
},{timestamps:true});

UserSchema.pre("save",function(next){

    const user = this;

    const salt = randomBytes(16).toString();
    console.log(salt);
    const hashedpasswod = createHmac('sha256',  salt).update(user.password).digest("hex");

    this.salt =  salt;
    this.password = hashedpasswod;
    next();
})


const User = new model("users",UserSchema);

module.exports = User;