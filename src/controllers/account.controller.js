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