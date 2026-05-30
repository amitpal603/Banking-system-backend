import Account from "../models/account.model.js";
import User from "../models/user.model.js"

/**
 * @desc    Create a new bank account for the authenticated user
 * @route   POST /api/accounts
 * @access  Private
 */

export const createAccount = async (req , res) => {
    const { _id } = req.user
 try {
    const account = await Account.create({ user : _id})
    res.status(201).json(account)
 } catch (error) {
    return res.status(500).json({message : "Internal server error"})
 }
    
}

export const getUserAccounts = async (req , res) => {
   const accounts = await Account.find({ user : req.user._id } 
   )
   res.status(200).json({accounts})
}

export const getAccountBalance = async (req , res) => {
   const {accountId} = req.params
   try {
   const account = await Account.findOne({_id : accountId , user : req.user._id})
   
   if(!account){
    return res.status(404).json({message : "Account not found"})
   }
   
   const balance = await account.getBalance()
   res.status(200).json({balance , accountId})
}
catch (error) {
      return res.status(500).json({message : "Internal server error"})
}
}