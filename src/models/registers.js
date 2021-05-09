const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const employeeSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    gender:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true,
        unique: true
    },
    age:{
        type: Number,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    confirmpassword:{
        type: String,
        required: true
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
})

//generate tokens
employeeSchema.methods.generateAuthToken = async function(){
    try{
        console.log(this._id);
        const token = jwt.sign({_id: this._id.toString()} , process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token: token});
        await this.save();
        return token;
    }catch(e){
        res.send(`Error is ${e}`);
        console.log(e);
    }
}

employeeSchema.pre("save",async function(next){
    if(this.isModified("password")){
        // console.log(`The Current Password is ${this.password}`); 
        this.password = await bcrypt.hash(this.password,10);
        // console.log(`The Password After Hash is ${this.password}`); 
        this.confirmpassword = await bcrypt.hash(this.password,10);
    }
    next();
})

//now we need to create colection
const Register = new mongoose.model("Register",employeeSchema);
module.exports = Register;