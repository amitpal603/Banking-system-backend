import jwt from "jsonwebtoken"
import User from "../models/user.model.js"


export const authMiddleware = async(req , res , next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

  if(!token) {
    return res.status(401).json({message : "Unauthorized"})
  }

  try {
    const decoded = jwt.verify(token , process.env.ACCESS_SECRET_TOKEN)
    const user = await User.findById(decoded._id)
    req.user = user
   return next()
  } catch (error) {
    res.status(401).json({message : "Unauthorized"})
  }
}