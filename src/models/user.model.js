import {Schema , model} from "mongoose"
import argon2 from "argon2"
const userSchema = new Schema({
    name : {
        type : String,
        required : [true , "Name is required"],
        minlength : [3 , "Name must be at least 3 characters long"]
    },
    email : {
        type : String,
        required : [true , "Email is required"],
        unique : [true , "Email already exists"],
        lowercase : true,
        match : [/\S+@\S+\.\S+/ , "Please provide a valid email address"]
    },
    password : {
        type : String,
        required : [true , "Password is required"],
        minlength : [6 , "Password must be at least 6 characters long"],
        select : false
    }
} , {timestamps: true})

userSchema.pre("save" , async function() {
    if(!this.isModified("password")){
        return 
    }
    try {
        const hashPassword = await argon2.hash(this.password)
        this.password = hashPassword
        
    }
    catch (error) {
        console.error("Error hashing password:", error)
    }
})

userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await argon2.verify(this.password, candidatePassword)    
    }
    catch (error) {
        console.error("Error comparing password:", error)
        return false
    }
}
const User = model("User" , userSchema)

export default User