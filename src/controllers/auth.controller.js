 import User from "../models/user.model.js";
 import jwt from "jsonwebtoken"
import { sendRegistrationEmail } from "../services/email.service.js";
 
 /**
  * @desc    User Registration
  * @route   POST /api/auth/register
  * @access  Public
  */
 export const userRegister = async (req , res) => {
    const {name , email , password} = req.body
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email })

        if(existingUser){
            return res.status(422).json({message : "User already exists"})
        }
        
        //! Create new user
        const newUser = new User({name , email , password})
        await newUser.save()

        const token = jwt.sign({_id : newUser._id} , process.env.ACCESS_SECRET_TOKEN , {expiresIn : "3d"})

        res.cookie("token" , token , {
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            sameSite : "strict",
            maxAge : 3 * 24 * 60 * 60 * 1000 // 3 days
        })
        res.status(201).json({
            message : "User registered successfully",
            _id : newUser._id,
            name : newUser.name,
            email : newUser.email,
            token
        })
        await sendRegistrationEmail(newUser.email , newUser.name)
    }
    catch (error) {
        res.status(500).json({message : "Internal server error"})
    }
}

/**
    * @desc    User Login
    * @route   POST /api/auth/login
    * @access  Public
 */
export const userLogin = async (req , res) => {
    const {email , password} = req.body
    try {
        const user = await User.findOne({ email}).select("+password")

        if(!user) {
            return res.status(404).json({message : "User not found"})
        }

        const isMatch = await user.comparePassword(password)

        if(!isMatch){
            return res.status(401).json({message : "Invalid credentials"})
        }

        const token = jwt.sign({_id : user._id} , process.env.ACCESS_SECRET_TOKEN , {expiresIn : "3d"})

        res.cookie("token" , token , {
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            sameSite : "strict",
            maxAge : 3 * 24 * 60 * 60 * 1000 // 3 days
        })
        res.status(200).json({
            message : "User logged in successfully",
            _id : user._id,
            name : user.name,
            email : user.email,
            token
        })
    } catch (error) {
        res.status(500).json({message : "Internal server error"})
    }
}

export const userLogout = async (req , res) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if(!token) {
        return res.status(400).json({message : "Token is required"})
    }
    res.cookie("token" , "")
    try {
        await blacklistModel.create({ token })
        res.status(200).json({message : "User logged out successfully"})
    } catch (error) {
        res.status(500).json({message : "Internal server error"})
    }
}

