import transactionModel from "../models/transaction.model.js";
import ledgerModel from "../models/ledger.model.js";
import accountModel from "../models/account.model.js";
import mongoose from "mongoose";
import { sendTransactionEmail } from "../services/email.service.js";
/**
 * - create a new transaction
 * THE 10-STEP TRANSFER FLOW
 *  1. Validate request
 *  2. Validate idempotency key
 *  3. Check account status
 *  4. Derive sender balance from ledger
 *  5. Create transaction (pending)
 *  6. Create Debit ledger entry
 *  7. Create Credit ledger entry
 *  8. Mark transaction completed
 *  9. Commit mongodb session
 *  10. Send email notification
 */

export const createTransaction = async (req, res) => {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  //! 1. Validate request
  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const fromUserAccount = await accountModel.findById({ _id: fromAccount });

  const toUserAccount = await accountModel.findById({ _id: toAccount });

  if (!fromUserAccount || !toUserAccount) {
    return res.status(404).json({ message: "One or both accounts not found" });
  }

  //! 2. Validate idempotency key
  const existingTransaction = await transactionModel.findOne({
    idempotencyKey,
  });

  if (existingTransaction) {
    if (existingTransaction.status === "COMPLETED") {
      return res.status(200).json({
        message: "Transaction already completed",
        transaction: existingTransaction,
      });
    }
    if (existingTransaction.status === "PENDING") {
      return res.status(200).json({
        message: "Transaction is still pending",
      });
    }
    if (existingTransaction.status === "FAILED") {
      return res.status(200).json({
        message: "Transaction already failed",
      });
    }
    if (existingTransaction.status === "REVERSED") {
      return res.status(200).json({
        message: "Transaction was reversed , please retry",
      });
    }
  }

  // ! 3. Check account status
   if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
    return res.status(400).json({message : "Both accounts must be active to perform transactions"})
   }

   // ? 4. Derive sender balance from ledger

   const balance = await fromUserAccount.getBalance();

   if(balance < amount){
    return res.status(400).json({message : `Insufficient balance. Available balance: ${balance}. Requested amount: ${amount}`})
   }

   //? 5. Create transaction (pending)
   let transaction
   try {
   const session = await mongoose.startSession()
   session.startTransaction()

   
     transaction = (await transactionModel.create([{
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status : "PENDING"
    }] , {session}))[0]

    const debitLedgerEntry = await ledgerModel.create([{
        account : fromAccount,
        type : "DEBIT",
        amount,
        transaction : transaction._id
    }] , {session})
    await (() => {
      return new Promise((resolve) => setTimeout(resolve , 15 * 1000))
    })()
    const creditLedgerEntry = await ledgerModel.create([{
        account : toAccount,
        type : "CREDIT",
        amount,
        transaction : transaction._id
    }] , {session})

   await transactionModel.findOneAndUpdate(
    {_id : transaction._id} ,
    {status : "COMPLETED"} ,
    {session , new : true}
   )

   await session.commitTransaction()
   session.endSession()
  } catch (error) {    return res.status(400).json({message : "Transaction is pending due to an error , please check back later"})
  }
    //? 10. Send email notification
    sendTransactionEmail(req.user.email , req.user.name , amount , toUserAccount._id)

    res.status(201).json({
        message : "Transaction completed successfully",
        transaction
    })
   
};

export const createInitialTransactionFunds = async (req , res) => {
    const { toAccount , amount , idempotencyKey } = req.body

    if(!toAccount || !amount || !idempotencyKey){
        return res.status(400).json({message : "All fields are required"})
    }

    const toUserAccount = await accountModel.findOne({ _id: toAccount });

    if (!toUserAccount) {
      return res.status(404).json({ message: "Account not found" });
    }

    const fromUserAccount = await accountModel.findOne(
        {
            
            user : req.user._id
        }
    );
    if(!fromUserAccount){
        return res.status(404).json({message : "System account not found"})
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const transaction = new transactionModel({
            fromAccount : fromUserAccount._id,
            toAccount,
            amount,
            idempotencyKey,
            status : "PENDING"
        })
        const debitLedgerEntry = await ledgerModel.create([{
            account : fromUserAccount._id,
            type : "DEBIT",
            amount,
            transaction : transaction._id
        } ], {session})
        const creditLedgerEntry = await ledgerModel.create([{
            account : toAccount,
            type : "CREDIT",
            amount,
            transaction : transaction._id
        } ], {session})
        transaction.status = "COMPLETED"
        await transaction.save({session})
        await session.commitTransaction()
        session.endSession()
        res.status(201).json({
            message : "Initial funds added successfully",
            transaction
        })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        return res.status(500).json({message : "Internal server error"})
    }
}
