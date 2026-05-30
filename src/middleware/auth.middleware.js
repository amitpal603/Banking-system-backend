import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import blacklistModel from "../models/blacklist.model.js"


export const authMiddleware = async(req , res , next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

  if(!token) {
    return res.status(401).json({message : "Unauthorized"})
  }
    const isBlacklisted = await blacklistModel.findOne({ token })

    if(isBlacklisted) {
        return res.status(401).json({message : "Unauthorized token is invalid"})
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

export const systemUserMiddleware = async(req , res , next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if(!token) {
      return res.status(401).json({message : "Unauthorized"})
    }
       const isBlacklisted = await blacklistModel.findOne({ token })

    if(isBlacklisted) {
        return res.status(401).json({message : "Unauthorized token is invalid"})
    }
    try {
      const decoded = jwt.verify(token , process.env.ACCESS_SECRET_TOKEN)
      const user = await User.findById(decoded._id).select("+systemUser")
      if(!user.systemUser) {
        return res.status(403).json({message : "Forbidden - System users only"})
      }
      req.user = user
     return next()
    } catch (error) {
      res.status(401).json({message : "Unauthorized"})
    }
}